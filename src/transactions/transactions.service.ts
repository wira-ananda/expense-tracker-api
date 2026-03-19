// src/transactions/transactions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Transaction } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

const prisma = new PrismaClient();

@Injectable()
export class TransactionsService {
  async createTransaction(userId: string, data: CreateTransactionDto) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId: userId,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return prisma.transaction.create({
      data: {
        type: category.type,
        amount: data.amount,
        note: data.note,
        transactionDate: data.transactionDate || new Date(),
        user: { connect: { id: userId } },
        category: { connect: { id: data.categoryId } },
      },
      include: {
        category: true,
      },
    });
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async getTransactionById(userId: string, id: string): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }
  async updateTransaction(
    userId: string,
    id: string,
    data: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    let nextType = transaction.type;

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
        },
      });

      if (!category) throw new NotFoundException('Category not found');
      nextType = category.type;
    }

    return prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        type: nextType,
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : undefined,
      },
    });
  }

  async deleteTransaction(userId: string, id: string): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');

    return prisma.transaction.delete({
      where: { id },
    });
  }
}
