import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationAttachmentService } from './application-attachment.service';
import { CreateApplicationAttachmentDto } from './dto/create-application-attachment.dto';
import { UpdateApplicationAttachmentDto } from './dto/update-application-attachment.dto';

@Controller('application-attachment')
export class ApplicationAttachmentController {
  constructor(private readonly applicationAttachmentService: ApplicationAttachmentService) {}

  @Post()
  create(@Body() createApplicationAttachmentDto: CreateApplicationAttachmentDto) {
    return this.applicationAttachmentService.create(createApplicationAttachmentDto);
  }

  @Get()
  findAll() {
    return this.applicationAttachmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationAttachmentDto: UpdateApplicationAttachmentDto) {
    return this.applicationAttachmentService.update(+id, updateApplicationAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationAttachmentService.remove(+id);
  }
}
