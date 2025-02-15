import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('Notification')
export class Notification {
  @PrimaryGeneratedColumn({ comment: '通知ID，主键' })
  notification_id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  recipient: User;

  @Column({ type: 'varchar', length: 100, comment: '通知标题' })
  title: string;

  @Column({ type: 'text', comment: '通知内容' })
  message: string;

  @Column({
    type: 'enum',
    enum: ['unread', 'read'],
    default: 'unread',
    comment: '通知状态：unread-未读，read-已读',
  })
  status: 'unread' | 'read';

  @CreateDateColumn({ type: 'datetime', comment: '通知生成时间' })
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '消息类型，如系统消息、邮件、短信（可选）',
  })
  message_type: string;
}
