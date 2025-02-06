import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(name: string, code: string, description: string) {
    const permission = this.permissionRepository.create({
      name,
      code,
      description,
    });
    return this.permissionRepository.save(permission);
  }

  async findAllPermissions() {
    return this.permissionRepository.find();
  }

  async findPermissionById(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async updatePermission(id: number, updateData: Partial<Permission>) {
    await this.permissionRepository.update(id, updateData);
    return this.findPermissionById(id);
  }

  async deletePermission(id: number) {
    await this.permissionRepository.delete(id);
    return { message: `Permission with ID ${id} deleted successfully` };
  }
}
