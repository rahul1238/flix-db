import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Fetch all users
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.handleDatabaseError(error, 'fetching all users');
    }
  }

  // Create a new user
  async createUser(userDto: CreateUserDto): Promise<User> {
    const { email, username } = userDto;

    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ username }, { email }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new BadRequestException('Email already exists');
        }
        if (existingUser.username === username) {
          throw new BadRequestException('Username already exists');
        }
      }

      const user = this.userRepository.create(userDto);
      await this.userRepository.save(user);
      return instanceToPlain(user) as User;
    } catch (error) {
      this.handleDatabaseError(error, 'creating user');
    }
  }

  // Find user by email
  async findOne(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.handleDatabaseError(error, 'finding user by email');
    }
  }

  // Change user's password
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    const { userId, oldPassword, newPassword } = changePasswordDto;

    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.handleDatabaseError(error, 'changing password');
    }
  }

  // Validate user's password
  async validateUserPassword(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      this.handleDatabaseError(error, 'validating user password');
    }
  }

  // Fetch a single user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      this.handleDatabaseError(error, 'fetching user by ID');
    }
  }

  // Handle database errors uniformly
  private handleDatabaseError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      `An error occurred while ${operation}. Please try again later.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
