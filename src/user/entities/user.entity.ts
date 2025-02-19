import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { FundInstitution } from '../../fund-institution/entities/fund-institution.entity';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';

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

  // 多对一关联基金机构, 使用机构ID作为外键
  @ManyToOne(() => FundInstitution, (institution) => institution.users)
  @JoinColumn({ name: 'institution_id' })
  institution: FundInstitution;

  // 一对多关联项目申请, 使用申请人ID作为外键
  @OneToMany(() => FundApplication, (application) => application.applicant)
  applications: FundApplication[];
}
