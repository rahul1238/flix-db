import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<{ users: User[]; message: string }> {
    const users = await this.userService.getAllUsers();
    if (users.length !== 0) {
      return {
        users,
        message: 'All users are fetched successfully!',
      };
    }
    return {
      message: 'No users found in the database, Please Add them',
      users,
    };
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<User | null> {
    changePasswordDto.userId = req.user.sub;
    return await this.userService.changePassword(changePasswordDto);
  }
}
