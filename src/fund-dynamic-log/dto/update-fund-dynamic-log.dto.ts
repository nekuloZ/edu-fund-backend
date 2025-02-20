import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateFundDynamicLogDto {
  // 允许更新部分字段，所有字段均为可选
  @IsOptional()
  @IsString({ message: '日志类型必须为字符串' })
  logType?: string;

  @IsOptional()
  @IsNumber({}, { message: '资金变动金额必须为数字' })
  amount?: number;

  @IsOptional()
  @IsString({ message: '交易日期必须为字符串（ISO 格式）' })
  transactionDate?: string;

  @IsOptional()
  @IsString({ message: '资金来源必须为字符串' })
  fundSource?: string;

  @IsOptional()
  @IsString({ message: '资金去向必须为字符串' })
  fundDestination?: string;

  @IsOptional()
  @IsString({ message: '变动状态必须为字符串' })
  status?: string;

  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  note?: string;
}
