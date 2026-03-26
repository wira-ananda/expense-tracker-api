import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from 'src/auth/interface/users.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
