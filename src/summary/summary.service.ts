import { Injectable } from '@nestjs/common';
import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SummaryService {
  async getSummary(userId: string, month?: string) {
    const where: any = { userId };

    // Filter by month jika ada query parameter
    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const start = new Date(year, mon - 1, 1); // 1st day of month
      const end = new Date(year, mon, 1); // 1st day of next month
      where.transactionDate = { gte: start, lt: end };
    }

    // Hitung total income
    const incomeAggregate = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { ...where, type: TransactionType.income },
    });

    // Hitung total expense
    const expenseAggregate = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { ...where, type: TransactionType.expense },
    });

    const income = Number(incomeAggregate._sum.amount || 0);
    const expense = Number(expenseAggregate._sum.amount || 0);
    const balance = income - expense;

    return { income, expense, balance };
  }
}
