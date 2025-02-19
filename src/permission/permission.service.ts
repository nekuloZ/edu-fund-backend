import { Injectable, NotFoundException } from '@nestjs/common';
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
   * 权限列表查询
   * 支持按权限名称搜索、排序和分页
   */
  async queryPermissions(
    queryDto: QueryPermissionDto,
  ): Promise<{ data: Permission[]; total: number }> {
    const { q, page = 1, limit = 10, sort } = queryDto;
    // 创建查询构造器
    const query = this.permissionRepository.createQueryBuilder('permission');

    // 如果提供搜索关键字，则根据权限名称进行模糊查询
    if (q) {
      query.where('permission.permission_name LIKE :q', { q: `%${q}%` });
    }

    // 如果传入排序参数，格式例如 "permission_name:asc"
    if (sort) {
      const [field, order] = sort.split(':');
      // 注意：这里只做简单的拼接，实际中建议校验字段名合法性
      query.orderBy(
        `permission.${field}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // 分页：跳过前面记录，限制返回条数
    query.skip((page - 1) * limit).take(limit);

    // 执行查询，获取数据和总记录数
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 根据权限 ID 获取权限详情
   */
  async getPermissionById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { permission_id: id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  /**
   * 创建新权限项
   * 根据传入的 CreatePermissionDto 创建并保存权限记录
   */
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  /**
   * 更新权限项
   * 根据权限 ID 更新权限的名称、描述等信息
   */
  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.getPermissionById(id);
    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  /**
   * 删除权限项
   * 删除时需要同步清除与角色关联记录（Role_Permission 表中的关联），
   * TypeORM 会根据实体关系配置自动处理级联删除或同步清除关联数据
   */
  async deletePermission(id: number): Promise<void> {
    const permission = await this.getPermissionById(id);
    await this.permissionRepository.remove(permission);
  }
}
