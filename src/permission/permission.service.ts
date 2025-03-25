import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * 创建权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // 检查权限名称是否已存在
    const existingByName = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingByName) {
      throw new ConflictException('权限名称已存在');
    }

    // 检查权限代码是否已存在
    const existingByCode = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });

    if (existingByCode) {
      throw new ConflictException('权限编码已存在');
    }

    // 创建新权限
    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      isActive: createPermissionDto.isActive ?? true,
    });

    return await this.permissionRepository.save(permission);
  }

  /**
   * 查询所有权限
   */
  async findAll(queryPermissionDto: QueryPermissionDto): Promise<{
    items: Permission[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      keyword,
      module,
      isActive,
    } = queryPermissionDto;

    // 构建查询
    const queryBuilder = this.permissionRepository
      .createQueryBuilder('permission')
      .skip((page - 1) * limit)
      .take(limit);

    // 添加过滤条件
    if (keyword) {
      queryBuilder.andWhere(
        '(permission.name LIKE :keyword OR permission.code LIKE :keyword OR permission.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (module) {
      queryBuilder.andWhere('permission.module = :module', { module });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('permission.isActive = :isActive', { isActive });
    }

    // 排序
    queryBuilder
      .orderBy('permission.module', 'ASC')
      .addOrderBy('permission.name', 'ASC');

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
   * 根据ID查找权限
   */
  async findById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: id.toString() },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`权限ID ${id} 不存在`);
    }

    return permission;
  }

  /**
   * 按模块分组获取权限
   */
  async findByModule(): Promise<{ [key: string]: Permission[] }> {
    const permissions = await this.permissionRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    // 按模块分组
    const result = {};
    permissions.forEach((permission) => {
      const module = permission.module || '未分类';
      if (!result[module]) {
        result[module] = [];
      }
      result[module].push(permission);
    });

    return result;
  }

  /**
   * 更新权限
   */
  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    // TODO: 实现更新权限的逻辑
    return {
      id,
      name: updatePermissionDto.name || '默认权限',
      code: updatePermissionDto.code || 'default:permission',
      description: updatePermissionDto.description || '',
      module: updatePermissionDto.module || 'default',
      isActive: updatePermissionDto.isActive ?? true,
      action: 'update',
      status: 'active',
      roles: [],
      operator: {
        id: '1',
        username: 'admin',
        password: '',
        avatar: '',
        email: 'admin@example.com',
        phoneNumber: '',
        isActive: true,
        realName: '管理员',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * 删除权限
   */
  async remove(_id: string): Promise<void> {
    // TODO: 实现删除权限的逻辑
  }

  async findOne(id: string): Promise<Permission> {
    // TODO: 实现获取单个权限的逻辑
    return {
      id,
      name: '示例权限',
      code: 'example:permission',
      module: 'example',
      action: 'permission',
      description: '示例权限描述',
      status: 'active',
      isActive: true,
      roles: [],
      operator: {
        id: '1',
        username: 'admin',
        password: '',
        avatar: '',
        email: 'admin@example.com',
        phoneNumber: '',
        isActive: true,
        realName: '管理员',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getStatistics() {
    // TODO: 实现获取权限统计数据的逻辑
    return {
      totalPermissions: 50,
      activePermissions: 45,
      inactivePermissions: 5,
    };
  }
}
