import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './module/auth.module';
import { TransactionsModule } from './module/transactions.module';
import { SummaryModule } from './module/summary.module';
import { CategoryModule } from './module/category.module';
import { PrismaModule } from './module/prisma.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TransactionsModule,
    SummaryModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
