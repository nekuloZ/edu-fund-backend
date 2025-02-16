import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateFundInstitutionDto {
  @IsNotEmpty()
  @IsString()
  institution_name: string; // 机构名称

  @IsOptional()
  @IsString()
  institution_code: string; // 机构编码（可选）

  @IsNotEmpty()
  @IsString()
  contact_person: string; // 联系人

  @IsOptional()
  @IsPhoneNumber()
  phone: string; // 联系电话

  @IsOptional()
  @IsEmail()
  email: string; // 邮箱地址

  @IsOptional()
  @IsString()
  address: string; // 机构地址

  @IsOptional()
  @IsString()
  description: string; // 机构描述
}
