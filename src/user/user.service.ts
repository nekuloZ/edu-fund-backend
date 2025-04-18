import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { QueryUserDto } from './dto/query-user.dto';
import {
  BatchStatusUpdateDto,
  BatchOperationDto,
} from './dto/batch-operation.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 创建用户：
   * 1. 检查用户名是否已存在
   * 2. 对密码进行加密
   * 3. 创建并保存用户记录
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 对密码进行加密处理
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户对象并保存到数据库
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 保存用户并返回结果（不包含密码）
    const savedUser = await this.userRepository.save(user);
    const { password: _password, ...result } = savedUser;
    return result as User;
  }

  /**
   * 根据ID查找用户
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${id} 未找到`);
    }

    return user;
  }

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.password',
        'user.email',
        'user.phoneNumber',
        'user.avatar',
        'user.realName',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.name',
      ])
      .where('user.username = :username', { username })
      .getOne();

    return user;
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User> {
    if (!email) return null;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.password',
        'user.email',
        'user.phoneNumber',
        'user.avatar',
        'user.realName',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.name',
      ])
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  /**
   * 更新用户信息
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 检查用户是否存在
    const user = await this.findById(id);

    // 如果请求更新密码，则加密新密码
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 更新用户信息
    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    // 移除返回结果中的密码字段
    const { password: _password, ...result } = updatedUser;
    return result as User;
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  /**
   * 为用户分配角色
   */
  async assignRoles(
    userId: string,
    assignRoleDto: AssignRoleDto,
  ): Promise<User> {
    // 查找用户
    const user = await this.findById(userId);

    // 查找角色
    const roles = await this.roleRepository.findBy({
      name: In(assignRoleDto.roles),
    });

    if (!roles.length) {
      throw new NotFoundException('未找到指定的角色');
    }

    // 更新用户角色
    user.roles = roles;
    await this.userRepository.save(user);

    return user;
  }

  /**
   * 分页查询用户
   */
  async findAll(queryUserDto: QueryUserDto): Promise<{
    items: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, keyword, role, isActive } = queryUserDto;

    // 构建查询条件
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.phoneNumber',
        'user.avatar',
        'user.realName',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.name',
        'role.description',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    // 添加条件过滤
    if (keyword) {
      queryBuilder.andWhere(
        '(user.username LIKE :keyword OR user.email LIKE :keyword OR user.realName LIKE :keyword OR user.phoneNumber LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('role.name = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    // 排序
    queryBuilder.orderBy('user.createdAt', 'DESC');

    // 执行查询
    const [items, total] = await queryBuilder.getManyAndCount();

    // 处理返回结果，移除密码字段
    const safeUsers = items.map((user) => {
      const { password: _password, ...result } = user;
      return result as User;
    });

    return {
      items: safeUsers,
      total,
      page,
      limit,
    };
  }

  /**
   * 批量删除用户
   */
  async batchRemove(batchDto: BatchOperationDto): Promise<void> {
    const users = await this.userRepository.findBy({
      id: In(batchDto.ids),
    });

    if (!users.length) {
      throw new BadRequestException('未找到指定的用户');
    }

    await this.userRepository.remove(users);
  }

  /**
   * 批量更新用户状态
   */
  async batchUpdateStatus(batchStatusDto: BatchStatusUpdateDto): Promise<void> {
    await this.userRepository.update(
      { id: In(batchStatusDto.ids) },
      { isActive: batchStatusDto.isActive },
    );
  }

  /**
   * 获取用户统计数据
   */
  async getStatistics() {
    // 获取总用户数
    const totalUsers = await this.userRepository.count();

    // 获取活跃用户数
    const activeUsers = await this.userRepository.count({
      where: { isActive: true },
    });

    // 获取非活跃用户数
    const inactiveUsers = await this.userRepository.count({
      where: { isActive: false },
    });

    // 获取角色分布
    const roleDistribution = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .select('role.name', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    // 转换角色分布为对象格式
    const roleDistributionObj = {};
    roleDistribution.forEach((item) => {
      roleDistributionObj[item.role] = parseInt(item.count, 10);
    });

    // 获取状态分布
    const statusDistribution = {
      active: activeUsers,
      inactive: inactiveUsers,
    };

    // 获取过去6个月的注册用户数
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistration = await this.userRepository
      .createQueryBuilder('user')
      .select("DATE_FORMAT(user.createdAt, '%Y-%m')", 'month')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // 转换月度注册用户数为数组格式
    const monthlyRegistrationArr = monthlyRegistration.map((item) => ({
      month: item.month,
      count: parseInt(item.count, 10),
    }));

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleDistribution: roleDistributionObj,
      statusDistribution,
      monthlyRegistration: monthlyRegistrationArr,
    };
  }
}
