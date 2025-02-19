import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFundInstitutionDto {
  // 机构名称不能为空
  @IsString()
  @IsNotEmpty()
  institution_name: string;

  // 机构编码可选
  @IsString()
  @IsOptional()
  institution_code?: string;

  // 联系人可选
  @IsString()
  @IsOptional()
  contact_person?: string;

  // 联系电话可选
  @IsString()
  @IsOptional()
  phone?: string;

  // 邮箱地址可选
  @IsString()
  @IsOptional()
  email?: string;

  // 机构地址可选
  @IsString()
  @IsOptional()
  address?: string;

  // 机构描述可选
  @IsString()
  @IsOptional()
  description?: string;
}
