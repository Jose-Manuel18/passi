import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RequestWithUser } from '../types/jwt-payload';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<{ headers?: Record<string, unknown> }>();
    const authHeader =
      typeof req.headers?.authorization === 'string'
        ? req.headers.authorization
        : '';
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Missing token');

    try {
      const payload: Record<string, unknown> = await this.jwt.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      (req as RequestWithUser).user = payload as unknown as JwtPayload;
      return true;
    } catch (e) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'name' in e &&
        (e as { name: string }).name === 'TokenExpiredError'
      )
        throw new UnauthorizedException('Token expired');
      throw new UnauthorizedException('Invalid token');
    }
  }
}
