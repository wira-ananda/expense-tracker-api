import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
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

    const authorizedPartiesRaw = this.configService.get<string>(
      'CLERK_AUTHORIZED_PARTIES',
    );

    const authorizedParties = authorizedPartiesRaw
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: clerkSecretKey,
        authorizedParties:
          authorizedParties && authorizedParties.length > 0
            ? authorizedParties
            : undefined,
      });

      if (!verifiedToken?.sub) {
        throw new UnauthorizedException('Token Clerk tidak valid');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          clerkId: verifiedToken.sub,
        },
        select: {
          id: true,
          clerkId: true,
          username: true,
          email: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User Clerk belum tersinkronisasi');
      }

      req.clerkUser = {
        clerkId: verifiedToken.sub,
      };

      req.user = {
        id: user.id,
        clerkId: user.clerkId,
        username: user.username,
        email: user.email,
      };

      return true;
    } catch (error) {
      console.error(
        'Clerk token verification error:',
        error instanceof Error ? error.message : error,
      );

      throw new UnauthorizedException('Token Clerk tidak valid');
    }
  }
}