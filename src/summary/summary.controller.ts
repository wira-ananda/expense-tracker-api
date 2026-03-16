import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthMiddleware } from '../auth/auth.middleware';
import { SummaryService } from './summary.service';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from 'src/users/interface/users.interface';

@Controller('summary')
@UseGuards(AuthMiddleware)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  async getSummary(
    @CurrentUser() user: User,
    @Query('month') month?: string, // format: "YYYY-MM"
  ) {
    return this.summaryService.getSummary(user.id, month);
  }
}
