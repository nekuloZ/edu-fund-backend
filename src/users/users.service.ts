// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // 注入用户实体的仓库
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto); // 创建用户实例
    return this.usersRepository.save(user); // 保存到数据库
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }
  async getUsers(page: number, pageSize: number) {
    try {
      const [users, total] = await this.usersRepository.findAndCount({
        relations: ['roles'],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: {
          id: 'ASC', // 添加排序
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
            name: role.name, // 如果数据库中为空，会返回空字符串
            permissions: role.permissions || [], // 防止权限字段为 null
          })),
        })),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto); // 更新用户
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id); // 删除用户
  }
}
