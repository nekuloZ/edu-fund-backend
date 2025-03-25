import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  /**
   * 创建学生
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  /**
   * 查询学生列表，支持分页和筛选
   */
  async findAll(queryDto: QueryStudentDto): Promise<{
    items: Student[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      keyword,
      schoolName,
      grade,
      gender,
      province,
      city,
      page = 1,
      limit = 10,
    } = queryDto;

    // 构建查询条件
    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    // 关键词搜索（姓名）
    if (keyword) {
      queryBuilder.andWhere('student.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // 按学校名称筛选
    if (schoolName) {
      queryBuilder.andWhere('student.schoolName LIKE :schoolName', {
        schoolName: `%${schoolName}%`,
      });
    }

    // 按年级筛选
    if (grade) {
      queryBuilder.andWhere('student.grade = :grade', { grade });
    }

    // 按性别筛选
    if (gender) {
      queryBuilder.andWhere('student.gender = :gender', { gender });
    }

    // 按省份筛选
    if (province) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(student.address, '$.province') = :province",
        { province },
      );
    }

    // 按城市筛选
    if (city) {
      queryBuilder.andWhere("JSON_EXTRACT(student.address, '$.city') = :city", {
        city,
      });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 添加分页
    queryBuilder
      .orderBy('student.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // 执行查询
    const items = await queryBuilder.getMany();

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
   * 查找单个学生
   */
  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['academicProgress', 'aidRecords'],
    });

    if (!student) {
      throw new NotFoundException(`ID为${id}的学生不存在`);
    }

    return student;
  }

  /**
   * 更新学生信息
   */
  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.findOne(id);

    // 合并更新数据
    const updatedStudent = { ...student, ...updateStudentDto };

    return this.studentRepository.save(updatedStudent);
  }

  /**
   * 删除学生
   */
  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  /**
   * 获取学业进度
   */
  async getAcademicProgress(id: string) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['academicProgress'],
    });

    if (!student) {
      throw new NotFoundException(`ID为${id}的学生不存在`);
    }

    // 按时间排序，最新的在前
    return student.academicProgress.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  /**
   * 获取资助记录
   */
  async getAidRecords(id: string) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['aidRecords'],
    });

    if (!student) {
      throw new NotFoundException(`ID为${id}的学生不存在`);
    }

    // 按时间排序，最新的在前
    return student.aidRecords.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  /**
   * 获取学生统计数据
   */
  async getStatistics() {
    // 总学生数
    const totalStudents = await this.studentRepository.count();

    // 按性别统计学生数量
    const genderStats = await this.studentRepository
      .createQueryBuilder('student')
      .select('student.gender', 'gender')
      .addSelect('COUNT(student.id)', 'count')
      .groupBy('student.gender')
      .getRawMany();

    // 按年级统计学生数量
    const gradeStats = await this.studentRepository
      .createQueryBuilder('student')
      .select('student.grade', 'grade')
      .addSelect('COUNT(student.id)', 'count')
      .where('student.grade IS NOT NULL')
      .groupBy('student.grade')
      .orderBy('student.grade', 'ASC')
      .getRawMany();

    // 按学校统计学生数量
    const schoolStats = await this.studentRepository
      .createQueryBuilder('student')
      .select('student.schoolName', 'schoolName')
      .addSelect('COUNT(student.id)', 'count')
      .groupBy('student.schoolName')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // 按省份统计
    const provinceStats = await this.studentRepository
      .createQueryBuilder('student')
      .select("JSON_EXTRACT(student.address, '$.province')", 'province')
      .addSelect('COUNT(student.id)', 'count')
      .groupBy("JSON_EXTRACT(student.address, '$.province')")
      .getRawMany();

    return {
      totalStudents,
      genderStats,
      gradeStats,
      schoolStats,
      provinceStats,
    };
  }
}
