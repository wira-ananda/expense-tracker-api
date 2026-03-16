// src/transactions/transactions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Transaction } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transactions.dto';

const prisma = new PrismaClient();

@Injectable()
export class TransactionsService {
  async createTransaction(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<Transaction> {
    return prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        note: data.note,
        transactionDate: data.transactionDate || new Date(),
        user: { connect: { id: userId } },
        category: { connect: { id: data.categoryId } },
      },
    });
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
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

    return prisma.transaction.update({
      where: { id },
      data,
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
