import { Module } from '@nestjs/common';
import { SummaryController } from './summary.controller';
import { ConfigModule } from '@nestjs/config';
import { SummaryService } from './summary.service';

@Module({
  imports: [ConfigModule],
  providers: [SummaryService],
  controllers: [SummaryController],
  exports: [SummaryService],
})
export class SummaryModule {}
