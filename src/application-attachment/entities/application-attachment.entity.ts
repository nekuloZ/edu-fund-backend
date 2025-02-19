import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FundApplication } from '../../fund-application/entities/fund-application.entity';

@Entity('Application_Attachment')
export class ApplicationAttachment {
  @PrimaryGeneratedColumn({ comment: '附件ID，主键' })
  attachment_id: number;

  @Column({ type: 'varchar', length: 255, comment: '文件存储路径或URL' })
  file_path: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '文件类型，如pdf、jpg等',
  })
  file_type: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '上传时间',
  })
  upload_date: Date;

  // 多对一：附件属于一个申请
  @ManyToOne(() => FundApplication, (application) => application.attachments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  application: FundApplication;
}
