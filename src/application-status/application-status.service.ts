import { Injectable } from '@nestjs/common';
import { CreateApplicationStatusDto } from './dto/create-application-status.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationStatusService {
  create(createApplicationStatusDto: CreateApplicationStatusDto) {
    return 'This action adds a new applicationStatus';
  }

  findAll() {
    return `This action returns all applicationStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationStatus`;
  }

  update(id: number, updateApplicationStatusDto: UpdateApplicationStatusDto) {
    return `This action updates a #${id} applicationStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationStatus`;
  }
}
