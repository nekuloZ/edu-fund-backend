import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentApplicationDto } from './create-student-application.dto';

export class UpdateStudentApplicationDto extends PartialType(CreateStudentApplicationDto) {}
