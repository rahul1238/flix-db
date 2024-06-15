import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: User; message: string }> {
    const user = await this.userService.createUser(createUserDto);
    return {
      user,
      message: 'User is created successfully!',
    };
  }
}
