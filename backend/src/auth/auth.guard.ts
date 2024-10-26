import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, jwtConstants } from 'src/public/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authType = this.getAuthType(context);

    if (authType === 'google') {
      return await this.handleGoogleAuth(context);
    } else {
      return this.handleJwtAuth(request, context);
    }
  }

  private getAuthType(context: ExecutionContext): string {
    const handler = context.getHandler();
    const authType = this.reflector.get<string>('authType', handler);
    return authType || 'jwt';
  }

  private async handleJwtAuth(
    request: Request,
    context: ExecutionContext,
  ): Promise<boolean> {
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
        this.logAndThrowUnauthorized(
          'User does not have permission to access this route',
        );
      }

      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      this.logAndThrowUnauthorized('Invalid token');
    }
  }

  private async handleGoogleAuth(context: ExecutionContext): Promise<boolean> {
    const guard = new (NestAuthGuard('google'))();
    const canActivate = await guard.canActivate(context);

    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        this.logAndThrowUnauthorized('Google authentication failed');
      }

      return true;
    } else {
      this.logAndThrowUnauthorized('Google authentication failed');
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
