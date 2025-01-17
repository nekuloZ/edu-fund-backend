import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller()
export class AppController {
  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  getAdminPage() {
    return 'Welcome, Admin!';
  }

  @Get('hello')
  getHello() {
    return 'Hello World!';
  }
}
