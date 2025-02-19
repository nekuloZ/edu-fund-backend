import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn({ comment: '角色ID，主键' })
  role_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色名称，如 admin、user、student 等',
  })
  role_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '角色描述' })
  description: string;

  // 多对多：角色对应多个用户
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  // 多对多：角色对应多个权限，通过中间表 Role_Permission 实现
  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
