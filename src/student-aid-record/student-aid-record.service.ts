import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentAidRecord } from './entities/student-aid-record.entity';
import { Student } from '../student/entities/student.entity';
import { Project, ProjectType } from '../project/entities/project.entity';
import { CreateStudentAidRecordDto } from './dto/create-student-aid-record.dto';
import { UpdateStudentAidRecordDto } from './dto/update-student-aid-record.dto';
import { QueryStudentAidRecordDto } from './dto/query-student-aid-record.dto';
import { AcknowledgeRecordDto } from './dto/acknowledge-record.dto';

@Injectable()
export class StudentAidRecordService {
  constructor(
    @InjectRepository(StudentAidRecord)
    private studentAidRecordRepository: Repository<StudentAidRecord>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  /**
   * 创建学生资助记录
   */
  async create(
    createDto: CreateStudentAidRecordDto,
  ): Promise<StudentAidRecord> {
    // 验证学生是否存在
    const student = await this.studentRepository.findOne({
      where: { id: createDto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`ID为${createDto.studentId}的学生不存在`);
    }

    // 验证项目是否存在（如果提供了项目ID）
    let project = null;
    if (createDto.projectId) {
      project = await this.projectRepository.findOne({
        where: { id: createDto.projectId },
      });

      if (!project) {
        throw new NotFoundException(`ID为${createDto.projectId}的项目不存在`);
      }

      // 验证项目类型是否适合学生资助
      if (
        project.projectType !== ProjectType.GRANT &&
        project.projectType !== ProjectType.SCHOLARSHIP
      ) {
        throw new BadRequestException(
          `项目类型不适用于学生资助。请选择助学金或奖学金类型的项目。`,
        );
      }
    }

    // 创建资助记录
    const aidRecord = this.studentAidRecordRepository.create({
      ...createDto,
      student,
      project,
    });

    return this.studentAidRecordRepository.save(aidRecord);
  }

  /**
   * 查询学生资助记录列表
   */
  async findAll(queryDto: QueryStudentAidRecordDto): Promise<{
    items: StudentAidRecord[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      studentId,
      projectId,
      aidType,
      acknowledged,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = queryDto;

    // 构建查询条件
    const queryBuilder = this.studentAidRecordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.student', 'student')
      .leftJoinAndSelect('record.project', 'project');

    // 学生ID筛选
    if (studentId) {
      queryBuilder.andWhere('record.studentId = :studentId', { studentId });
    }

    // 项目ID筛选
    if (projectId) {
      queryBuilder.andWhere('record.projectId = :projectId', { projectId });
    }

    // 资助类型筛选
    if (aidType) {
      queryBuilder.andWhere('record.aidType = :aidType', { aidType });
    }

    // 确认状态筛选
    if (acknowledged !== undefined) {
      queryBuilder.andWhere('record.acknowledged = :acknowledged', {
        acknowledged,
      });
    }

    // 日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('record.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('record.date >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('record.date <= :endDate', { endDate });
    }

    // 计算总记录数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder
      .orderBy('record.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // 执行查询
    const items = await queryBuilder.getMany();

    // 返回结果
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 查找单个资助记录
   */
  async findOne(id: string): Promise<StudentAidRecord> {
    const record = await this.studentAidRecordRepository.findOne({
      where: { id },
      relations: ['student', 'project'],
    });

    if (!record) {
      throw new NotFoundException(`ID为${id}的资助记录不存在`);
    }

    return record;
  }

  /**
   * 更新资助记录
   */
  async update(
    id: string,
    updateDto: UpdateStudentAidRecordDto,
  ): Promise<StudentAidRecord> {
    const record = await this.findOne(id);

    // 验证学生是否存在（如果提供了学生ID）
    if (updateDto.studentId && updateDto.studentId !== record.studentId) {
      const student = await this.studentRepository.findOne({
        where: { id: updateDto.studentId },
      });

      if (!student) {
        throw new NotFoundException(`ID为${updateDto.studentId}的学生不存在`);
      }

      record.student = student;
    }

    // 验证项目是否存在（如果提供了项目ID）
    if (
      updateDto.projectId !== undefined &&
      updateDto.projectId !== record.projectId
    ) {
      if (updateDto.projectId) {
        const project = await this.projectRepository.findOne({
          where: { id: updateDto.projectId },
        });

        if (!project) {
          throw new NotFoundException(`ID为${updateDto.projectId}的项目不存在`);
        }

        // 验证项目类型是否适合学生资助
        if (
          project.projectType !== ProjectType.GRANT &&
          project.projectType !== ProjectType.SCHOLARSHIP
        ) {
          throw new BadRequestException(
            `项目类型不适用于学生资助。请选择助学金或奖学金类型的项目。`,
          );
        }

        record.project = project;
      } else {
        record.project = null;
      }
    }

    // 更新资助记录
    Object.assign(record, updateDto);

    return this.studentAidRecordRepository.save(record);
  }

  /**
   * 删除资助记录
   */
  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.studentAidRecordRepository.remove(record);
  }

  /**
   * 确认资助记录
   */
  async acknowledgeRecord(
    id: string,
    acknowledgeDto: AcknowledgeRecordDto,
  ): Promise<StudentAidRecord> {
    const record = await this.findOne(id);

    if (record.acknowledged) {
      throw new BadRequestException('该资助记录已经被确认');
    }

    record.acknowledged = acknowledgeDto.acknowledged;
    record.acknowledgedAt = new Date();

    if (acknowledgeDto.remarks) {
      // 添加确认备注时，保留原有备注
      record.remarks = record.remarks
        ? `${record.remarks}\n确认备注: ${acknowledgeDto.remarks}`
        : `确认备注: ${acknowledgeDto.remarks}`;
    }

    return this.studentAidRecordRepository.save(record);
  }

  /**
   * 获取学生所有资助记录
   */
  async findAllByStudent(studentId: string): Promise<StudentAidRecord[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`ID为${studentId}的学生不存在`);
    }

    return this.studentAidRecordRepository.find({
      where: { studentId },
      relations: ['project'],
      order: { date: 'DESC' },
    });
  }

  /**
   * 获取项目下的所有资助记录
   */
  async findAllByProject(projectId: string): Promise<StudentAidRecord[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`ID为${projectId}的项目不存在`);
    }

    return this.studentAidRecordRepository.find({
      where: { projectId },
      relations: ['student'],
      order: { date: 'DESC' },
    });
  }

  /**
   * 获取学生资助统计
   */
  async getStatistics() {
    // 总金额统计
    const totalAmountResult = await this.studentAidRecordRepository
      .createQueryBuilder('record')
      .select('SUM(record.amount)', 'totalAmount')
      .getRawOne();

    const totalAmount = Number(totalAmountResult.totalAmount) || 0;

    // 按资助类型统计金额
    const aidTypeStats = await this.studentAidRecordRepository
      .createQueryBuilder('record')
      .select('record.aidType', 'aidType')
      .addSelect('SUM(record.amount)', 'totalAmount')
      .addSelect('COUNT(record.id)', 'count')
      .groupBy('record.aidType')
      .getRawMany();

    // 未确认资助记录统计
    const unacknowledgedCount = await this.studentAidRecordRepository.count({
      where: { acknowledged: false },
    });

    // 按月统计资助金额（最近12个月）
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(today.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await this.studentAidRecordRepository
      .createQueryBuilder('record')
      .select("DATE_FORMAT(record.date, '%Y-%m')", 'month')
      .addSelect('SUM(record.amount)', 'totalAmount')
      .addSelect('COUNT(record.id)', 'count')
      .where('record.date >= :twelveMonthsAgo', { twelveMonthsAgo })
      .groupBy("DATE_FORMAT(record.date, '%Y-%m')")
      .orderBy("DATE_FORMAT(record.date, '%Y-%m')", 'ASC')
      .getRawMany();

    return {
      totalAmount,
      aidTypeStats,
      unacknowledgedCount,
      monthlyStats,
    };
  }
}
