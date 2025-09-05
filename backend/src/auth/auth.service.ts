import {Injectable,UnauthorizedException,BadRequestException,HttpException,HttpStatus,} from '@nestjs/common';
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
        password: '',
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
    // Security: do not leak whether email exists; exit silently if not found
    if (!user) {
      await new Promise((r) => setTimeout(r, 300)); // minor delay to obscure enumeration timing
      return;
    }
    const resetToken = await this.userService.generateResetToken(user.id);
    const frontend = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontend.replace(/\/$/, '')}/reset-password?token=${resetToken}`;
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
    const from =
      this.configService.get('MAIL_FROM') || this.configService.get('MAIL_USER');
    const driver = (this.configService.get('MAIL_DRIVER') || 'smtp').toLowerCase();
    const mailOptions = {
      from,
      to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. If you did not, you can ignore this email.</p><p><a href="${resetLink}">Reset Password</a></p><p>This link expires in 1 hour.</p>`,
    };

    if (driver === 'disable' || driver === 'none') {
      // Mail sending intentionally disabled (accept silently)
      console.warn('[Auth] MAIL_DRIVER=disable: skipping actual email send. Reset link:', resetLink);
      return;
    }

    if (driver === 'log') {
      console.info('[Auth] MAIL_DRIVER=log (email not sent). Payload:', { to, resetLink });
      return;
    }

    try {
      if (!from) {
        throw new Error('Missing MAIL_FROM / MAIL_USER for sender address');
      }
      await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      // Swallow error to avoid breaking client flow; optionally could rethrow
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
