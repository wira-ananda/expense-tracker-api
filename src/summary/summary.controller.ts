import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthMiddleware } from '../auth/auth.middleware';
import { SummaryService } from './summary.service';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from 'src/auth/interface/users.interface';

@ApiTags('Summary')
@ApiBearerAuth()
@Controller('summary')
@UseGuards(AuthMiddleware)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil ringkasan income, expense, dan balance' })
  @ApiQuery({
    name: 'month',
    required: false,
    example: '2026-03',
    description: 'Filter bulan dengan format YYYY-MM',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary berhasil diambil',
    schema: {
      example: {
        income: 1000000,
        expense: 350000,
        balance: 650000,
      },
    },
  })
  async getSummary(@CurrentUser() user: User, @Query('month') month?: string) {
    return this.summaryService.getSummary(user.id, month);
  }
}
