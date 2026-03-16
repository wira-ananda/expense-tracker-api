import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// 4️⃣ Cara Pakai Guard di route lain
// import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';

// @Controller('users')
// export class UsersController {
//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Req() req) {
//     return req.user; // berisi id dari JWT
//   }
// }
