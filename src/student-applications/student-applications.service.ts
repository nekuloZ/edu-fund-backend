import { Injectable } from '@nestjs/common';
import { CreateStudentApplicationDto } from './dto/create-student-application.dto';
import { UpdateStudentApplicationDto } from './dto/update-student-application.dto';

@Injectable()
export class StudentApplicationsService {
  create(createStudentApplicationDto: CreateStudentApplicationDto) {
    return 'This action adds a new studentApplication';
  }

  findAll() {
    return `This action returns all studentApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentApplication`;
  }

  update(id: number, updateStudentApplicationDto: UpdateStudentApplicationDto) {
    return `This action updates a #${id} studentApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentApplication`;
  }
}
