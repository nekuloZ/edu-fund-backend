import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FrontUserController } from './front-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
  controllers: [UserController, FrontUserController],
  exports: [UserService],
})
export class UserModule {}
