// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, AuthMiddleware],
  controllers: [AuthController],
  exports: [AuthService, AuthMiddleware],
})
export class AuthModule {}
