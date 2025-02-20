import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFundDynamicLogDto {
  @IsNotEmpty({ message: '日志类型不能为空' })
  @IsString({ message: '日志类型必须为字符串' })
  logType: string; // 例如 "disbursement", "donation" 等

  @IsNotEmpty({ message: '资金变动金额不能为空' })
  @IsNumber({}, { message: '资金变动金额必须为数字' })
  amount: number; // 资金变动金额，必须大于零

  // 交易日期可以由前端传入（ISO 格式字符串），如不传由后端设置当前时间
  @IsOptional()
  @IsString({ message: '交易日期必须为字符串（ISO 格式）' })
  transactionDate?: string;

  @IsNotEmpty({ message: '资金来源不能为空' })
  @IsString({ message: '资金来源必须为字符串' })
  fundSource: string; // 如拨款来源机构、捐赠者等

  @IsNotEmpty({ message: '资金去向不能为空' })
  @IsString({ message: '资金去向必须为字符串' })
  fundDestination: string; // 例如项目名称、账户信息等

  @IsNotEmpty({ message: '变动状态不能为空' })
  @IsString({ message: '变动状态必须为字符串' })
  status: 'pending' | 'completed' | 'failed';

  // 可选补充说明，用于记录日志相关的备注信息
  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  note?: string;
}
