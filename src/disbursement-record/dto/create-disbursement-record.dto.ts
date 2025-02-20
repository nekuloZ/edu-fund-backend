import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDisbursementRecordDto {
  @IsNotEmpty({ message: '关联的申请ID不能为空' })
  @IsNumber({}, { message: '关联的申请ID必须为数字' })
  applicationId: number;

  @IsNotEmpty({ message: '拨款金额不能为空' })
  @IsNumber({}, { message: '拨款金额必须为数字' })
  disbursementAmount: number;

  // 拨款时间可由前端传入（ISO 格式字符串），如不传默认由后端设置当前时间
  @IsOptional()
  @IsString({ message: '拨款时间必须为字符串格式（ISO日期）' })
  disbursementDate?: string;

  @IsNotEmpty({ message: '操作员ID不能为空' })
  @IsNumber({}, { message: '操作员ID必须为数字' })
  operatorId: number;

  // 拨款状态可选，由财务操作设置，默认状态可由后端赋值
  @IsOptional()
  @IsString({ message: '拨款状态必须为字符串' })
  status: 'pending' | 'confirmed' | 'failed';

  // 附加备注信息
  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  note?: string;
}
