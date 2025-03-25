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

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

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
