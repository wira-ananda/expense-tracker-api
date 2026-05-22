import { Module } from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { TransactionsController } from '../controller/transactions.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthMiddleware],
})
export class TransactionsModule {}
