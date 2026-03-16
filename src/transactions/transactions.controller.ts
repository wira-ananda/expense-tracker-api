import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transactions.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from 'src/users/interface/users.interface';

@Controller('transactions')
@UseGuards(AuthMiddleware) // semua route butuh token
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@CurrentUser() user: User, @Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(user.id, body);
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.transactionsService.getTransactions(user.id);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.getTransactionById(user.id, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(user.id, id, body);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.deleteTransaction(user.id, id);
  }
}
