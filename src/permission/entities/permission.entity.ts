import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity('Permission')
export class Permission {
  @PrimaryGeneratedColumn({ comment: '权限ID，主键' })
  permission_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '权限名称，如申请提交、审核操作、拨款确认等',
  })
  permission_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '权限描述' })
  description: string;

  // 多对多：权限对应多个角色
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
