import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthMiddleware],
})
export class TransactionsModule {}
