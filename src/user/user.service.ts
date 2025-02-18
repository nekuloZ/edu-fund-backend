import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 用户注册业务逻辑：
   * 1. 检查用户名是否已存在
   * 2. 对密码进行加密
   * 3. 创建并保存用户记录
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
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
    return await this.userRepository.save(user);
  }

  /**
   * 根据用户ID获取用户详情，并加载关联角色数据
   */
  async findById(id: number): Promise<User> {
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
   * 根据用户名获取用户详情
   */
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  /**
   * 更新用户信息：
   * 1. 如果包含密码字段，则先加密新密码
   * 2. 更新用户的其他信息
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  /**
   * 删除用户：
   * 删除用户记录（级联删除用户与角色、权限关联）
   */
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * 分配角色给指定用户：
   * 1. 根据传入的角色ID数组查询角色
   * 2. 将角色分配给用户并保存
   */
  async assignRoles(
    userId: number,
    assignRoleDto: AssignRoleDto,
  ): Promise<User> {
    // 根据用户ID查询用户详情
    const user = await this.findById(userId);

    // 根据传入的角色ID查询角色记录
    const roles = await this.roleRepository.findByIds(assignRoleDto.roleIds);
    if (!roles || roles.length === 0) {
      throw new NotFoundException('未找到对应的角色');
    }

    // 更新用户的角色信息
    user.roles = roles;
    return await this.userRepository.save(user);
  }
}
