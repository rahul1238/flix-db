import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(userDto: CreateUserDto): Promise<User | null> {
    try {
      const user = this.userRepository.create(userDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.error('Error while creating user:', error);
      return null;
    }
  }

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
}
