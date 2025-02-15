import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn({ comment: '角色ID，主键' })
  role_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment:
      '角色名称，如applicant、auditor、finance、admin、fund_institution等',
  })
  role_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '角色描述' })
  description: string;

  // 角色与用户的多对多关系
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  // 角色与权限的多对多关系，通过Role_Permission中间表
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'Role_Permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  })
  permissions: Permission[];
}
