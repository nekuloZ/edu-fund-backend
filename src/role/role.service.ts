import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { Permission } from '../permission/entities/permission.entity'; // 假设 Permission 实体在 src/permission/permission.entity.ts

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * 角色列表查询
   * 支持搜索（按角色名称）、排序和分页
   */
  async queryRoles(
    queryDto: QueryRoleDto,
  ): Promise<{ data: Role[]; total: number }> {
    const { q, page = 1, limit = 10, sort } = queryDto;
    // 使用 QueryBuilder 构建查询语句
    const query = this.roleRepository.createQueryBuilder('role');

    // 如果传入搜索关键字，则根据角色名称进行模糊查询
    if (q) {
      query.where('role.role_name LIKE :q', { q: `%${q}%` });
    }

    // 如果传入排序参数，格式为 "field:direction" 例如 "role_name:asc"
    if (sort) {
      const [field, order] = sort.split(':');
      // 注意：这里假设传入的字段名称是合法的
      query.orderBy(`role.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    }

    // 分页处理：跳过前面的记录，并限制返回数量
    query.skip((page - 1) * limit).take(limit);

    // 执行查询，返回数据和总记录数
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  /**
   * 根据角色 ID 获取角色详情，同时加载该角色关联的权限数据
   */
  async getRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role_id: id },
      relations: ['permissions'], // 加载与角色关联的权限数据
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  /**
   * 创建新角色
   * 根据传入的 CreateRoleDto 创建并保存新角色记录
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  /**
   * 更新角色信息
   * 根据角色 ID 更新角色的名称、描述等信息
   */
  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.getRoleById(id);
    // 将传入的更新数据合并到现有角色对象中
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  /**
   * 删除角色
   * 删除角色时需要级联删除与用户和权限的关联记录，确保数据一致性
   */
  async deleteRole(id: number): Promise<void> {
    const role = await this.getRoleById(id);
    // 直接调用 remove 方法，TypeORM 会根据实体关系配置自动处理级联删除
    await this.roleRepository.remove(role);
  }

  /**
   * 角色与权限关联管理
   * 为指定角色分配权限（支持增加或移除权限），
   * assignPermissionDto 中传入权限 ID 数组
   */
  async assignPermissions(
    roleId: number,
    assignPermissionDto: AssignPermissionDto,
  ): Promise<Role> {
    const role = await this.getRoleById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    // 根据传入的权限ID数组查找对应的权限记录
    const permissions = await this.permissionRepository.findByIds(
      assignPermissionDto.permissionIds,
    );
    if (permissions.length === 0) {
      throw new BadRequestException(
        'No valid permissions found for provided IDs',
      );
    }
    // 更新角色的权限关联
    role.permissions = permissions;
    return await this.roleRepository.save(role);
  }
}
