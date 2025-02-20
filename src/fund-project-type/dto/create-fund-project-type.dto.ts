import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFundProjectTypeDto {
  @IsNotEmpty({ message: '项目类型名称不能为空' })
  @IsString({ message: '项目类型名称必须是字符串' })
  projectTypeName: string; // 例如: public_pool、scholarship、grant 等

  @IsNotEmpty({ message: '描述不能为空' })
  @IsString({ message: '描述必须是字符串' })
  description: string;
}
