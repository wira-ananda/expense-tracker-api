import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat module ini bisa diakses di mana saja tanpa perlu import berulang kali
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export agar service bisa digunakan di module lain
})
export class PrismaModule {}
