import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty({ message: '通知标题不能为空' })
  @IsString({ message: '通知标题必须为字符串' })
  title: string;

  @IsNotEmpty({ message: '通知内容不能为空' })
  @IsString({ message: '通知内容必须为字符串' })
  message: string;

  @IsNotEmpty({ message: '接收者ID不能为空' })
  @IsNumber({}, { message: '接收者ID必须为数字' })
  recipientId: number;

  @IsNotEmpty({ message: '通知类型不能为空' })
  @IsString({ message: '通知类型必须为字符串' })
  notificationType: string; // 如 system、email、sms 等

  // 生成时间一般由后端自动设置，如前端传入，则需符合 ISO 格式
  @IsOptional()
  @IsString({ message: '生成时间必须为字符串（ISO 格式）' })
  createdAt?: string;

  @IsNotEmpty({ message: '通知状态不能为空' })
  @IsString({ message: '通知状态必须为字符串' })
  status: 'unread' | 'read'; // 如 unread（未读）、read（已读）

  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  note?: string;
}
