import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export const CATEGORY_TYPES = {
  income: 'income',
  expense: 'expense',
} as const;

export type CategoryTypeDto =
  (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Makan',
    description: 'Nama kategori',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoryname: string;

  @ApiProperty({
    enum: CATEGORY_TYPES,
    example: CATEGORY_TYPES.expense,
    description: 'Tipe kategori',
  })
  @IsEnum(CATEGORY_TYPES)
  type: CategoryTypeDto;
}