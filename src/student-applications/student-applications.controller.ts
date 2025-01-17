import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentApplicationsService } from './student-applications.service';
import { CreateStudentApplicationDto } from './dto/create-student-application.dto';
import { UpdateStudentApplicationDto } from './dto/update-student-application.dto';

@Controller('student-applications')
export class StudentApplicationsController {
  constructor(
    private readonly studentApplicationsService: StudentApplicationsService,
  ) {}

  @Post()
  create(@Body() createStudentApplicationDto: CreateStudentApplicationDto) {
    return this.studentApplicationsService.create(createStudentApplicationDto);
  }

  @Get()
  findAll() {
    return this.studentApplicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentApplicationDto: UpdateStudentApplicationDto,
  ) {
    return this.studentApplicationsService.update(
      +id,
      updateStudentApplicationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentApplicationsService.remove(+id);
  }
}
