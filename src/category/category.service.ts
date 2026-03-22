import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service'; // Pastikan path ini benar
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  // Selalu inject PrismaService, jangan buat instance manual di dalam class
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      // Konsisten dengan urutan yang rapi
      orderBy: [{ type: 'asc' }, { categoryname: 'asc' }],
    });
  }

  async create(userId: string, dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          userId,
          categoryname: dto.categoryname.trim(),
          type: dto.type,
        },
      });
    } catch (error) {
      // Menangani Unique Constraint Error dari Prisma (P2002)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Kategori dengan nama yang sama sudah ada');
      }

      // Log error asli jika perlu untuk debugging internal
      console.error(error);
      throw new InternalServerErrorException('Gagal membuat kategori');
    }
  }
}
