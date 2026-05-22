import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    example: '9c6b2e38-6f5c-4fd2-9d1a-1d3f8e3f19aa',
    description: 'ID kategori milik user',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 50000,
    description: 'Nominal transaksi',
  })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    example: 'Makan siang di kampus',
    description: 'Catatan transaksi',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    example: '2026-03-20T10:30:00.000Z',
    description: 'Tanggal transaksi dalam format ISO 8601',
  })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;
}
