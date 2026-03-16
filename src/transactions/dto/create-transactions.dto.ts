import { TransactionType } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  categoryId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDate()
  transactionDate?: Date;
}
