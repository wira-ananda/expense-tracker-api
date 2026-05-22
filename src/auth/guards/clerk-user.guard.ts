import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClerkUserGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Tidak ada token Clerk');
    }

    const token = authHeader.split(' ')[1];
    const clerkSecretKey = this.configService.get<string>('CLERK_SECRET_KEY');

    if (!clerkSecretKey) {
      throw new UnauthorizedException('CLERK_SECRET_KEY belum di-set');
    }

    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: clerkSecretKey,
      });

      if (!verifiedToken?.sub) {
        throw new UnauthorizedException('Token Clerk tidak valid');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          clerkId: verifiedToken.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User Clerk belum tersinkronisasi');
      }

      req.user = user;

      return true;
    } catch {
      throw new UnauthorizedException('Token Clerk tidak valid');
    }
  }
}