import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { User } from 'src/users/interface/users.interface';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(AuthMiddleware)
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
