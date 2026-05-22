import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { User } from 'src/auth/interface/users.interface';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ClerkAuthGuard } from 'src/auth/guards/clerk-auth.guard';
import { ClerkUserGuard } from 'src/auth/guards/clerk-user.guard';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(ClerkAuthGuard)
@UseGuards(ClerkUserGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua kategori milik user' })
  @ApiResponse({ status: 200, description: 'Daftar kategori berhasil diambil' })
  async findAll(@CurrentUser() user: User) {
    return this.categoryService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Buat kategori baru' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat' })
  @ApiResponse({ status: 409, description: 'Nama kategori sudah digunakan' })
  async create(@Body() dto: CreateCategoryDto, @CurrentUser() user: User) {
    return this.categoryService.create(user.id, dto);
  }
}
