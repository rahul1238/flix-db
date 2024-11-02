import { Body, Controller, Post, Request, UseGuards, Get, HttpException, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard as GoogleAuth } from '@nestjs/passport';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Group: Authentication
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

  @Get('google')
  @UseGuards(GoogleAuth('google'))
  @SetMetadata('authType', 'google')
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuth('google'))
  @SetMetadata('authType', 'google')
  async googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new HttpException(
        {
          success: false,
          message: 'Google authentication failed. No user data returned.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
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

  @Post('google/sign-in')
  async googleSignIn(
    @Body() googleSignInDto: GoogleSignInDto,
  ): Promise<{ success: boolean; data?: any; message: string }> {
    const { token } = googleSignInDto;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
      );

      if (response.status !== 200 || !response.data.email) {
        throw new HttpException('Invalid Google token', HttpStatus.UNAUTHORIZED);
      }

      const googleUser = response.data;
      const user = await this.authService.googleLogin({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      });

      return {
        success: true,
        data: user,
        message: 'Google sign-in successful',
      };
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw new HttpException(
        'Google sign-in failed. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
