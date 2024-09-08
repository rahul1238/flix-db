import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Handle user login and return a JWT access token
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Validate user credentials
    const user = await this.userService.validateUserPassword(email, password);
    if (!user) {
      this.handleUnauthorized('Invalid credentials');
    }

    // Generate JWT token with user payload
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // Handle unauthorized exceptions uniformly
  private handleUnauthorized(message: string): never {
    console.error(`Unauthorized access attempt: ${message}`);
    throw new UnauthorizedException(message);
  }
}
