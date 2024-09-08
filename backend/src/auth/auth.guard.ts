import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, jwtConstants } from 'src/public/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logAndThrowUnauthorized('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;

      const allowedRoles = this.reflector.get<Role[]>(
        'role',
        context.getHandler(),
      );

      if (allowedRoles && !allowedRoles.includes(payload.role)) {
        this.logAndThrowUnauthorized('User does not have permission to access this route');
      }

      return true;
    } catch (error) {
      this.logAndThrowUnauthorized('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    return authHeader.split(' ')[1];
  }

  private logAndThrowUnauthorized(message: string): never {
    console.error(`Unauthorized access attempt: ${message}`);
    throw new UnauthorizedException(message);
  }
}
