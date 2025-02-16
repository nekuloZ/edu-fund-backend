import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt-strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret_key', // 设置 JWT 密钥
      signOptions: { expiresIn: '60s' }, // 设置 JWT 过期时间
    }),
    UserModule, // 引入用户模块
  ],
  providers: [JwtStrategy, JwtAuthGuard], // 提供 JwtStrategy 和 JwtAuthGuard
  exports: [JwtAuthGuard], // 导出 JwtAuthGuard 供其他模块使用
})
export class AuthModule {}
