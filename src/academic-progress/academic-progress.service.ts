import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AcademicProgress,
  ProgressStatus,
} from './entities/academic-progress.entity';
import { Student } from '../student/entities/student.entity';
import { CreateAcademicProgressDto } from './dto/create-academic-progress.dto';
import { UpdateAcademicProgressDto } from './dto/update-academic-progress.dto';
import { QueryAcademicProgressDto } from './dto/query-academic-progress.dto';

@Injectable()
export class AcademicProgressService {
  constructor(
    @InjectRepository(AcademicProgress)
    private readonly academicProgressRepository: Repository<AcademicProgress>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  /**
   * 创建学业进展记录
   */
  async create(
    createDto: CreateAcademicProgressDto,
  ): Promise<AcademicProgress> {
    // 验证学生是否存在
    const student = await this.studentRepository.findOne({
      where: { id: createDto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`ID为${createDto.studentId}的学生不存在`);
    }

    // 计算平均分（如果没有提供）
    if (!createDto.averageScore && createDto.grades?.length > 0) {
      const totalScore = createDto.grades.reduce(
        (sum, grade) => sum + grade.score,
        0,
      );
      createDto.averageScore = parseFloat(
        (totalScore / createDto.grades.length).toFixed(2),
      );
    }

    // 确定进度状态（如果没有提供）
    if (!createDto.status && createDto.averageScore) {
      createDto.status = this.determineStatus(createDto.averageScore);
    }

    // 创建学业进展记录
    const progress = this.academicProgressRepository.create({
      ...createDto,
      student,
    });

    return this.academicProgressRepository.save(progress);
  }

  /**
   * 查询学业进展记录列表
   */
  async findAll(queryDto: QueryAcademicProgressDto): Promise<{
    items: AcademicProgress[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      studentId,
      semester,
      status,
      minAverageScore,
      maxAverageScore,
      page = 1,
      limit = 10,
    } = queryDto;

    // 构建查询条件
    const queryBuilder = this.academicProgressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.student', 'student');

    // 学生ID筛选
    if (studentId) {
      queryBuilder.andWhere('progress.studentId = :studentId', { studentId });
    }

    // 学期筛选
    if (semester) {
      queryBuilder.andWhere('progress.semester = :semester', { semester });
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('progress.status = :status', { status });
    }

    // 平均分范围筛选
    if (minAverageScore !== undefined && maxAverageScore !== undefined) {
      queryBuilder.andWhere(
        'progress.averageScore BETWEEN :minAvg AND :maxAvg',
        {
          minAvg: minAverageScore,
          maxAvg: maxAverageScore,
        },
      );
    } else if (minAverageScore !== undefined) {
      queryBuilder.andWhere('progress.averageScore >= :minAvg', {
        minAvg: minAverageScore,
      });
    } else if (maxAverageScore !== undefined) {
      queryBuilder.andWhere('progress.averageScore <= :maxAvg', {
        maxAvg: maxAverageScore,
      });
    }

    // 计算总记录数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder
      .orderBy('progress.createdAt', 'DESC')
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
   * 查找单个学业进展记录
   */
  async findOne(id: string): Promise<AcademicProgress> {
    const progress = await this.academicProgressRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!progress) {
      throw new NotFoundException(`ID为${id}的学业进展记录不存在`);
    }

    return progress;
  }

  /**
   * 更新学业进展记录
   */
  async update(
    id: string,
    updateDto: UpdateAcademicProgressDto,
  ): Promise<AcademicProgress> {
    const progress = await this.findOne(id);

    // 验证学生是否存在（如果提供了学生ID）
    if (updateDto.studentId && updateDto.studentId !== progress.studentId) {
      const student = await this.studentRepository.findOne({
        where: { id: updateDto.studentId },
      });

      if (!student) {
        throw new NotFoundException(`ID为${updateDto.studentId}的学生不存在`);
      }

      progress.student = student;
    }

    // 如果更新了成绩，重新计算平均分
    if (updateDto.grades) {
      const totalScore = updateDto.grades.reduce(
        (sum, grade) => sum + grade.score,
        0,
      );
      updateDto.averageScore = parseFloat(
        (totalScore / updateDto.grades.length).toFixed(2),
      );

      // 重新确定状态
      updateDto.status = this.determineStatus(updateDto.averageScore);
    }

    // 更新学业进展记录
    Object.assign(progress, updateDto);
    return this.academicProgressRepository.save(progress);
  }

  /**
   * 删除学业进展记录
   */
  async remove(id: string): Promise<void> {
    const progress = await this.findOne(id);
    await this.academicProgressRepository.remove(progress);
  }

  /**
   * 获取学生的所有学业进展记录
   */
  async findAllByStudent(studentId: string): Promise<AcademicProgress[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`ID为${studentId}的学生不存在`);
    }

    return this.academicProgressRepository.find({
      where: { studentId },
      order: { semester: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * 获取学生的最新学业进展
   */
  async getLatestProgressByStudent(
    studentId: string,
  ): Promise<AcademicProgress> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`ID为${studentId}的学生不存在`);
    }

    const latestProgress = await this.academicProgressRepository.findOne({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });

    if (!latestProgress) {
      throw new NotFoundException(`ID为${studentId}的学生没有学业进展记录`);
    }

    return latestProgress;
  }

  /**
   * 批量添加学生成绩
   */
  async batchCreate(records: CreateAcademicProgressDto[]): Promise<{
    successful: number;
    failed: number;
    errors: string[];
  }> {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const record of records) {
      try {
        await this.create(record);
        successful++;
      } catch (error) {
        failed++;
        errors.push(`学生ID ${record.studentId}: ${error.message}`);
      }
    }

    return {
      successful,
      failed,
      errors,
    };
  }

  /**
   * 根据平均分判断进度状态
   */
  private determineStatus(averageScore: number): ProgressStatus {
    if (averageScore >= 90) {
      return ProgressStatus.EXCELLENT;
    } else if (averageScore >= 80) {
      return ProgressStatus.GOOD;
    } else if (averageScore >= 70) {
      return ProgressStatus.AVERAGE;
    } else if (averageScore >= 60) {
      return ProgressStatus.NEEDS_IMPROVEMENT;
    } else {
      return ProgressStatus.CONCERNING;
    }
  }

  /**
   * 获取学生学业进展统计
   */
  async getProgressStatistics(studentId: string): Promise<{
    trendData: { semester: string; averageScore: number }[];
    bestSubject: { subject: string; averageScore: number };
    worstSubject: { subject: string; averageScore: number };
    statusDistribution: Record<ProgressStatus, number>;
  }> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`ID为${studentId}的学生不存在`);
    }

    // 获取学生所有学业进展记录
    const progressRecords = await this.academicProgressRepository.find({
      where: { studentId },
      order: { semester: 'ASC' },
    });

    if (progressRecords.length === 0) {
      throw new NotFoundException(`ID为${studentId}的学生没有学业进展记录`);
    }

    // 学期平均分趋势
    const trendData = progressRecords.map((record) => ({
      semester: record.semester,
      averageScore: Number(record.averageScore),
    }));

    // 计算各科目的平均分
    const subjectScores: Record<string, { totalScore: number; count: number }> =
      {};

    progressRecords.forEach((record) => {
      record.grades.forEach((grade) => {
        if (!subjectScores[grade.subject]) {
          subjectScores[grade.subject] = { totalScore: 0, count: 0 };
        }
        subjectScores[grade.subject].totalScore += grade.score;
        subjectScores[grade.subject].count += 1;
      });
    });

    // 计算各科目平均分
    const subjectAverages = Object.entries(subjectScores).map(
      ([subject, { totalScore, count }]) => ({
        subject,
        averageScore: parseFloat((totalScore / count).toFixed(2)),
      }),
    );

    // 找出最好和最差科目
    subjectAverages.sort((a, b) => b.averageScore - a.averageScore);
    const bestSubject = subjectAverages[0] || {
      subject: '无数据',
      averageScore: 0,
    };
    const worstSubject = subjectAverages[subjectAverages.length - 1] || {
      subject: '无数据',
      averageScore: 0,
    };

    // 统计各状态的数量
    const statusDistribution = Object.values(ProgressStatus).reduce(
      (acc, status) => {
        acc[status] = progressRecords.filter(
          (record) => record.status === status,
        ).length;
        return acc;
      },
      {} as Record<ProgressStatus, number>,
    );

    return {
      trendData,
      bestSubject,
      worstSubject,
      statusDistribution,
    };
  }
}
