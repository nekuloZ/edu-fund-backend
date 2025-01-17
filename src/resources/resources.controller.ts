import { Controller, Get, UseGuards } from '@nestjs/common';
import { DeviceGuard } from '../auth/device.guard';

@Controller('resources')
export class ResourcesController {
  @UseGuards(DeviceGuard)
  @Get()
  getResource() {
    return { message: 'Resource accessed successfully' };
  }
}
