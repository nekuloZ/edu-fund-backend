import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(newRole);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }
  async findByName(name: string): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { name: Like(`%${name}%`) }, // 模糊搜索
    });
  }
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const roles = await this.dataSource
      .createQueryBuilder()
      .select('role.name', 'name')
      .from('user_roles', 'userRole')
      .innerJoin('roles', 'role', 'userRole.role_id = role.id')
      .where('userRole.user_id = :userId', { userId })
      .getRawMany();

    return roles.map((role) => role.name);
  }
}
