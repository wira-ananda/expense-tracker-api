import { Module } from '@nestjs/common';
import { SummaryController } from '../controller/summary.controller';
import { ConfigModule } from '@nestjs/config';
import { SummaryService } from '../service/summary.service';

@Module({
  imports: [ConfigModule],
  providers: [SummaryService],
  controllers: [SummaryController],
  exports: [SummaryService],
})
export class SummaryModule {}
