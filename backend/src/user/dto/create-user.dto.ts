import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/public/common';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  status: string;

  @IsOptional()
  role: Role;
}
