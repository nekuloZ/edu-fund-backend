import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectFundsService } from './project-funds.service';
import { CreateProjectFundDto } from './dto/create-project-fund.dto';
import { UpdateProjectFundDto } from './dto/update-project-fund.dto';

@Controller('project-funds')
export class ProjectFundsController {
  constructor(private readonly projectFundsService: ProjectFundsService) {}

  @Post()
  create(@Body() createProjectFundDto: CreateProjectFundDto) {
    return this.projectFundsService.create(createProjectFundDto);
  }

  @Get()
  findAll() {
    return this.projectFundsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectFundsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectFundDto: UpdateProjectFundDto) {
    return this.projectFundsService.update(+id, updateProjectFundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectFundsService.remove(+id);
  }
}
