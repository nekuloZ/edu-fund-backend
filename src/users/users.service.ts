// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto); // 创建用户实例
    return this.usersRepository.save(user); // 保存到数据库
  }
  /**
   * 获取用户列表，支持分页和模糊搜索
   * @param page 当前页码
   * @param pageSize 每页大小
   * @param search 搜索关键字（可选）
   */
  async getUsers(page: number, pageSize: number, search?: string) {
    try {
      const where = search ? { username: Like(`%${search}%`) } : {};

      const [users, total] = await this.usersRepository.findAndCount({
        where,
        relations: ['roles'],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: {
          id: 'ASC',
        },
      });

      return {
        currentPage: page,
        pageSize,
        total,
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          roles: user.roles.map((role) => ({
            id: role.id,
            name: role.name || 'N/A', // 防止空值
            permissions: role.permissions || [], // 防止 null 值
          })),
        })),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * 根据 ID 更新用户
   * @param id 用户 ID
   * @param updateUserDto 更新用户信息 DTO
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  /**
   * 根据 ID 删除用户
   * @param id 用户 ID
   */
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
