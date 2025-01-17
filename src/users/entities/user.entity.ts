// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('users') // 表名
export class User {
  @PrimaryGeneratedColumn() // 自动生成主键
  id: number;

  @Column({ unique: true }) // 唯一约束
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true }) // 可为空
  email: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' }) // 默认时间
  createdAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[]; // 表示该用户拥有的所有角色
  @OneToMany(() => Project, (project) => project.manager)
  projects: Project[];
}
