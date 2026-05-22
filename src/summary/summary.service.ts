import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SummaryService {
  async getSummary(userId: string, month?: string) {
    const where: {
      userId: string;
      transactionDate?: {
        gte: Date;
        lt: Date;
      };
    } = {
      userId,
    };

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1);

      where.transactionDate = {
        gte: start,
        lt: end,
      };
    }

    const incomeAggregate = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ...where,
        type: 'income',
      },
    });

    const expenseAggregate = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ...where,
        type: 'expense',
      },
    });

    const income = Number(incomeAggregate._sum.amount || 0);
    const expense = Number(expenseAggregate._sum.amount || 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}