import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // 检查角色名是否已存在
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('角色名称已存在');
    }

    // 创建角色实例
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      isActive: createRoleDto.isActive ?? true,
    });

    // 如果提供了权限ID，则关联权限
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissionIds),
      });

      if (permissions.length !== createRoleDto.permissionIds.length) {
        throw new BadRequestException('部分权限ID不存在');
      }

      role.permissions = permissions;
    }

    // 保存角色
    return await this.roleRepository.save(role);
  }

  /**
   * 查询所有角色
   */
  async findAll(queryRoleDto: QueryRoleDto): Promise<{
    items: Role[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, keyword, isActive } = queryRoleDto;

    // 构建查询
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .select([
        'role.id',
        'role.name',
        'role.description',
        'role.isActive',
        'role.createdAt',
        'role.updatedAt',
        'permission.id',
        'permission.name',
        'permission.code',
        'permission.description',
        'permission.module',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    // 添加过滤条件
    if (keyword) {
      queryBuilder.andWhere(
        '(role.name LIKE :keyword OR role.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('role.isActive = :isActive', { isActive });
    }

    // 排序
    queryBuilder.orderBy('role.createdAt', 'DESC');

    // 执行查询
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 根据ID查找角色
   */
  async findById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`角色ID ${id} 不存在`);
    }

    return role;
  }

  /**
   * 更新角色信息
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    // 如果要更新名称，检查名称是否已存在
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('角色名称已存在');
      }
    }

    // 更新角色属性
    Object.assign(role, updateRoleDto);

    // 保存更新
    return await this.roleRepository.save(role);
  }

  /**
   * 删除角色
   */
  async remove(id: number): Promise<void> {
    const role = await this.findById(id);
    await this.roleRepository.remove(role);
  }

  /**
   * 为角色分配权限
   */
  async assignPermissions(
    id: number,
    assignPermissionDto: AssignPermissionDto,
  ): Promise<Role> {
    const role = await this.findById(id);

    // 查找权限
    const permissions = await this.permissionRepository.findBy({
      id: In(assignPermissionDto.permissionIds),
    });

    if (permissions.length !== assignPermissionDto.permissionIds.length) {
      throw new BadRequestException('部分权限ID不存在');
    }

    // 更新角色权限
    role.permissions = permissions;
    return await this.roleRepository.save(role);
  }
}
