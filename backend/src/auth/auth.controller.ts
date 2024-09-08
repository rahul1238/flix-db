import { Body, Controller, Post, Request, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Handle user login
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ success: boolean; data?: any; message: string }> {
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
  getProfile(@Request() req): { success: boolean; data?: any; message: string } {
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

  // Handle controller-level errors uniformly
  private handleControllerError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      { success: false, message: `An error occurred while ${operation}. Please try again later.` },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
