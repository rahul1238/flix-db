import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard as GoogleAuth } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Handle user login
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ success: boolean; data?: any; message: string }> {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        data: result,
        message: 'Login successful',
      };
    } catch (error) {
      this.handleControllerError(error, 'logging in');
    }
  }

  // Get the profile of the authenticated user
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req): {
    success: boolean;
    data?: any;
    message: string;
  } {
    try {
      return {
        success: true,
        data: req.user,
        message: 'Profile fetched successfully',
      };
    } catch (error) {
      this.handleControllerError(error, 'fetching profile');
    }
  }

  // Handle forgot password requests
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.authService.forgotPassword(forgotPasswordDto.email);
      return {
        success: true,
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      this.handleControllerError(error, 'processing forgot password');
    }
  }

  // Handle password reset requests
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      this.handleControllerError(error, 'resetting password');
    }
  }

  // Initiate Google OAuth process
  @Get('google')
  @UseGuards(GoogleAuth('google'))
  @SetMetadata('authType', 'google')
  async googleAuth() {}

  @Post('google/redirect')
  @UseGuards(GoogleAuth('google'))
  @SetMetadata('authType', 'google')
  async googleAuthRedirect(@Req() req) {
    try {
      const user = await this.authService.googleLogin(req.user);
      return {
        success: true,
        data: user,
        message: 'Google login successful',
      };
    } catch (error) {
      this.handleControllerError(error, 'Google authentication');
    }
  }

  // Handle controller-level errors uniformly
  private handleControllerError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      {
        success: false,
        message: `An error occurred while ${operation}. Please try again later.`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
