import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createRole(roleName: string, description: string): Promise<Role> {
    const role = this.roleRepository.create({
      role_name: roleName,
      description,
    });
    return await this.roleRepository.save(role);
  }
}
