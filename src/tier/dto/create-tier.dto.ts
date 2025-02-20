import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTierDto {
  @IsNotEmpty({ message: '档次名称不能为空' })
  @IsString({ message: '档次名称必须为字符串' })
  tierName: string; // 例如：211、985、双非

  @IsNotEmpty({ message: '奖金额度不能为空' })
  @IsNumber({}, { message: '奖金额度必须为数字' })
  awardAmount: number; // 对应奖金额度

  @IsNotEmpty({ message: '适用条件不能为空' })
  @IsString({ message: '适用条件必须为字符串' })
  conditions: string; // 适用条件描述
}
