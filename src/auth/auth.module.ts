// auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { ClerkUserGuard } from './guards/clerk-user.guard';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [AuthService, AuthMiddleware, ClerkAuthGuard, ClerkUserGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthMiddleware, ClerkAuthGuard, ClerkUserGuard],
})
export class AuthModule {}