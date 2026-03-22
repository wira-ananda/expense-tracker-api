import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
    enum: CategoryType,
    example: CategoryType.expense,
    description: 'Tipe kategori',
  })
  @IsEnum(CategoryType)
  type: CategoryType;
}
