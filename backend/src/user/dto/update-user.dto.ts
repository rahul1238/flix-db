import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/public/common';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  role: Role;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  phone: string;
}
