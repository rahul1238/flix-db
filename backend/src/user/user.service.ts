import { BadRequestException, Injectable } from '@nestjs/common';
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
    private userRepository: Repository<User>,
  ) {}

  //getAllUsers method
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //create
  async createUser(userDto: CreateUserDto): Promise<User> {
    const { email, username } = userDto;
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
  }

  //find user by email
  async findOne(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        console.error('No User found with this email:', email);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error while finding user:', error);
      return null;
    }
  }

  //change password
  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<User | null> {
    const { userId, oldPassword, newPassword } = changePasswordDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await this.userRepository.save(user);

    return user;
  }

  //validate user password
  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
