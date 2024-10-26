import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/public/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // Handle user login and return a JWT access token
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userService.validateUserPassword(email, password);
    if (!user) {
      this.handleUnauthorized('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  // Google login handler
  async googleLogin(user): Promise<{ accessToken: string }> {
    if (!user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    let existingUser = await this.userService.findUserByEmail(user.email);

    if (!existingUser) {
      const newUser: CreateUserDto = {
        email: user.email,
        username: user.email.split('@')[0],
        name: user.name || 'No Name',
        password: null,
        role: Role.USER,
        phone: '',
        status: 'active',
        avatar: user.picture || '',
      };

      existingUser = await this.userService.createUser(newUser);
    }

    const payload = {
      email: existingUser.email,
      sub: existingUser.id,
      role: existingUser.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  // Initiate forgot password process by generating a reset token and sending an email
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const resetToken = await this.userService.generateResetToken(user.id);
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    await this.sendResetPasswordEmail(email, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.userService.resetPassword(token, newPassword);
  }

  // Send reset password email
  private async sendResetPasswordEmail(
    to: string,
    resetLink: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get('MAIL_USER'),
      to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    };

    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new HttpException(
        'Failed to send reset password email. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Handle unauthorized exceptions uniformly
  private handleUnauthorized(message: string): never {
    console.error(`Unauthorized access attempt: ${message}`);
    throw new UnauthorizedException(message);
  }
}
