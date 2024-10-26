import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { instanceToPlain } from 'class-transformer';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  // Fetch all users
  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(): Promise<{ users: User[]; message: string }> {
    try {
      const users = await this.userService.getAllUsers();
      const message = users.length
        ? 'All users are fetched successfully!'
        : 'No users found in the database, Please Add them';
      return { users, message };
    } catch (error) {
      this.handleServiceError(error, 'fetching all users');
    }
  }

  // Create a new user
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      if (avatar) {
        const avatarUrl = await this.uploadService.uploadImage(avatar);
        createUserDto.avatar = avatarUrl;
      }
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      this.handleServiceError(error, 'creating user');
    }
  }

  // Change password for a user
  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<User> {
    try {
      changePasswordDto.userId = req.user.sub;
      return await this.userService.changePassword(changePasswordDto);
    } catch (error) {
      this.handleServiceError(error, 'changing password');
    }
  }

  // Fetch a single user by ID
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        user: instanceToPlain(user) as User,
        message: 'User fetched successfully',
      };
    } catch (error) {
      this.handleServiceError(error, 'fetching user by ID');
    }
  }

  //Update a user by ID
  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ success: boolean; user?: User; message: string }> {
    if (avatar) {
      const avatarUrl = await this.uploadService.uploadImage(avatar);
      updateUserDto.avatar = avatarUrl;
    }
    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDto,
      );
      return {
        success: true,
        user: instanceToPlain(updatedUser) as User,
        message: 'User updated successfully',
      };
    } catch (error) {
      this.handleServiceError(error, 'updating user');
    }
  }

  // Handle service errors uniformly
  private handleServiceError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      `An error occurred while ${operation}. Please try again later.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
