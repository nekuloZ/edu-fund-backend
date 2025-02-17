import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity('User') // 对应数据库中的 User 表
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ unique: true, comment: '用户名，唯一' })
  username: string;

  @Column({ comment: '加密后的密码' })
  password: string;

  @Column({ nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ nullable: true, comment: '邮箱地址' })
  email: string;

  @Column({ nullable: true, comment: '头像URL' })
  avatar: string;

  // 多对多关联角色，使用中间表 User_Role 实现
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'User_Role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
