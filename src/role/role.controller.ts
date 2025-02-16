import { Controller, Post, Body } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(
    @Body()
    { roleName, description }: { roleName: string; description: string },
  ) {
    return this.roleService.createRole(roleName, description);
  }
}
