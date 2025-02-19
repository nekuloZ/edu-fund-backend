import { IsString, IsOptional } from 'class-validator';

export class UpdateFundInstitutionDto {
  // 机构名称更新
  @IsString()
  @IsOptional()
  institution_name?: string;

  // 机构编码更新
  @IsString()
  @IsOptional()
  institution_code?: string;

  // 联系人更新
  @IsString()
  @IsOptional()
  contact_person?: string;

  // 联系电话更新
  @IsString()
  @IsOptional()
  phone?: string;

  // 邮箱地址更新
  @IsString()
  @IsOptional()
  email?: string;

  // 机构地址更新
  @IsString()
  @IsOptional()
  address?: string;

  // 机构描述更新
  @IsString()
  @IsOptional()
  description?: string;
}
