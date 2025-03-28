import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProjectTimeline } from '../../project-timeline/entities/project-timeline.entity';
import { Donation } from '../../donation/entities/donation.entity';
import { ProjectApplication } from '../../project-application/entities/project-application.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';

// 添加项目类型枚举
export enum ProjectType {
  GRANT = 'grant', // 助学金项目
  SCHOLARSHIP = 'scholarship', // 奖学金项目
  SCHOOL_CONSTRUCTION = 'school_construction', // 学校建设项目
  TEACHER_TRAINING = 'teacher_training', // 师资培训项目
  SPECIAL_EDUCATION = 'special_education', // 特殊教育项目
  NUTRITION_IMPROVEMENT = 'nutrition_improvement', // 营养改善项目
  STUDENT_DEVELOPMENT = 'student_development', // 学生综合素质发展项目
  GENERAL_FUND = 'general_fund', // 公共池
  VOCATIONAL_EDUCATION = 'vocational_education', // 职业教育项目
  RESEARCH_INNOVATION = 'research_innovation', // 科研创新项目
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // 添加项目类型字段
  @ApiProperty({
    description: '项目类型',
    enum: ProjectType,
    example: ProjectType.GENERAL_FUND,
  })
  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.GENERAL_FUND,
    name: 'project_type',
  })
  projectType: ProjectType;

  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'target_amount' })
  targetAmount: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'raised_amount',
    default: 0,
  })
  raisedAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'ongoing', 'completed', 'failed'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'simple-json', nullable: true })
  location: {
    province: string;
    city: string;
    district: string;
    address: string;
    coordinates: [number, number];
  };

  @Column({ type: 'simple-array' })
  category: string[];

  @Column({ default: 0 })
  beneficiaries: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  gallery: string[];

  @OneToMany(() => ProjectTimeline, (timeline) => timeline.project)
  timeline: ProjectTimeline[];

  @OneToMany(() => Donation, (donation) => donation.project)
  donations: Donation[];

  @OneToMany(() => ProjectApplication, (application) => application.project)
  applications: ProjectApplication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('roles')
export class Role {
  @ApiProperty({ description: '角色ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '角色名称', example: 'admin' })
  @Column({ length: 50, unique: true })
  name: string;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: '角色状态', example: true, default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ type: () => [User], description: '拥有此角色的用户' })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ApiProperty({ type: () => [Permission], description: '角色拥有的权限' })
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
