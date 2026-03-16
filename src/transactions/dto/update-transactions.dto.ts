import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transactions.dto';
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
