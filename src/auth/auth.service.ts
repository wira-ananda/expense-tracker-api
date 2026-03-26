import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private generateToken(userId: string) {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET belum di-set');
    }

    return jwt.sign({ id: userId }, secret, {
      expiresIn: '7d',
    });
  }

  async register(username: string, email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: hashedPassword,
        },
      });

      const token = this.generateToken(user.id);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email sudah terdaftar');
      }

      console.error(error);
      throw new InternalServerErrorException('Gagal registrasi');
    }
  }

  async login(usernameOrEmail: string, password: string) {
    const cleanedInput = usernameOrEmail.trim();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: cleanedInput.toLowerCase() }, { username: cleanedInput }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Username/email atau password salah');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Username/email atau password salah');
    }

    const token = this.generateToken(user.id);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    return user;
  }
}
