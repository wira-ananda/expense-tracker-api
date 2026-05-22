import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTransactionDto } from '../dto/transactions/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/transactions/update-transaction.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}
  async createTransaction(userId: string, data: CreateTransactionDto) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.transaction.create({
      data: {
        type: category.type,
        amount: data.amount,
        note: data.note,
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : new Date(),
        user: {
          connect: {
            id: userId,
          },
        },
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
      include: {
        category: true,
      },
    });
  }

  async getTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });
  }

  async getTransactionsByMonth(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, 1, 0, 0, 0, 0);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });

    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      year,
      month,
      income,
      expense,
      balance: income - expense,
      transactions,
    };
  }

  async getTransactionById(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateTransaction(
    userId: string,
    id: string,
    data: UpdateTransactionDto,
  ) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    let nextType = transaction.type;

    if (data.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      nextType = category.type;
    }

    return this.prisma.transaction.update({
      where: {
        id,
      },
      data: {
        ...data,
        type: nextType,
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async deleteTransaction(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.delete({
      where: {
        id,
      },
    });
  }
}