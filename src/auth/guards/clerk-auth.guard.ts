import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

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

    const authorizedParties = (
      this.configService.get<string>('CLERK_AUTHORIZED_PARTIES') || ''
    )
      .split(',')
      .map((party) => party.trim())
      .filter(Boolean);

    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: clerkSecretKey,
        authorizedParties:
          authorizedParties.length > 0 ? authorizedParties : undefined,
      });

      if (!verifiedToken?.sub) {
        throw new UnauthorizedException('Token Clerk tidak valid');
      }

      req.clerkUser = {
        clerkId: verifiedToken.sub,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token Clerk tidak valid');
    }
  }
}