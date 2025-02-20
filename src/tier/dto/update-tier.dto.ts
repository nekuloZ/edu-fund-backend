import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTierDto {
  @IsOptional()
  @IsString({ message: '档次名称必须为字符串' })
  tierName?: string;

  @IsOptional()
  @IsNumber({}, { message: '奖金额度必须为数字' })
  awardAmount?: number;

  @IsOptional()
  @IsString({ message: '适用条件必须为字符串' })
  conditions?: string;
}
