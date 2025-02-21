import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  // 通常允许更新通知状态，如标记为已读；其他字段可根据需要更新
  @IsOptional()
  @IsString({ message: '通知状态必须为字符串' })
  status?: string;

  @IsOptional()
  @IsString({ message: '通知标题必须为字符串' })
  title?: string;

  @IsOptional()
  @IsString({ message: '通知内容必须为字符串' })
  message?: string;

  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  note?: string;
}
