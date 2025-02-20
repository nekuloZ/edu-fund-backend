import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateDisbursementRecordDto {
  // 可更新拨款金额（在必要情况下）
  @IsOptional()
  @IsNumber({}, { message: '拨款金额必须为数字' })
  disbursementAmount?: number;

  // 可更新拨款时间
  @IsOptional()
  @IsString({ message: '拨款时间必须为字符串格式（ISO日期）' })
  disbursementDate?: string;

  // 可更新操作员信息，如更换执行拨款的人员
  @IsOptional()
  @IsNumber({}, { message: '操作员ID必须为数字' })
  operatorId?: number;

  // 可更新拨款状态，例如 pending、confirmed、failed
  @IsOptional()
  @IsString({ message: '拨款状态必须为字符串' })
  status?: string;

  // 可更新备注信息
  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  note?: string;
}
