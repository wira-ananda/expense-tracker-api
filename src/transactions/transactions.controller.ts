import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from 'src/users/interface/users.interface';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(AuthMiddleware)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Buat transaksi baru' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaksi berhasil dibuat',
  })
  async create(@CurrentUser() user: User, @Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua transaksi user' })
  @ApiResponse({
    status: 200,
    description: 'Daftar transaksi berhasil diambil',
  })
  async findAll(@CurrentUser() user: User) {
    return this.transactionsService.getTransactions(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail transaksi berdasarkan ID' })
  @ApiParam({
    name: 'id',
    example: '9c6b2e38-6f5c-4fd2-9d1a-1d3f8e3f19aa',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail transaksi berhasil diambil',
  })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.getTransactionById(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaksi' })
  @ApiParam({
    name: 'id',
    example: '9c6b2e38-6f5c-4fd2-9d1a-1d3f8e3f19aa',
  })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'Transaksi berhasil diperbarui',
  })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus transaksi' })
  @ApiParam({
    name: 'id',
    example: '9c6b2e38-6f5c-4fd2-9d1a-1d3f8e3f19aa',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaksi berhasil dihapus',
  })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.deleteTransaction(user.id, id);
  }
}
