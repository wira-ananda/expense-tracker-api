import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetTransactionsByMonthDto {
  @ApiProperty({
    example: 2026,
    description: 'Tahun transaksi',
  })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number;

  @ApiProperty({
    example: 3,
    description: 'Bulan transaksi (1-12)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;
}
