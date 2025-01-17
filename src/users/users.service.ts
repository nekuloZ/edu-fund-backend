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

  findAll(): Promise<User[]> {
    return this.usersRepository.find(); // 查询所有用户
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } }); // 按 ID 查询用户
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
