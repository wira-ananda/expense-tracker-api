import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Tidak ada token');
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new UnauthorizedException('JWT_SECRET belum di-set');

    try {
      const decoded = jwt.verify(token, secret) as { id: string };
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}
