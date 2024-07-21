import { IsString, IsEnum, IsDateString, IsOptional, IsArray } from 'class-validator';
import { Type, Status } from 'src/public/common';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsEnum(Type)
  type: Type;

  @IsString()
  origin: string;

  @IsString()
  description: string;

  @IsDateString()
  releaseDate: Date;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsArray()
  @IsOptional()
  imageUrl?: string[];

  @IsString()
  genreId: number;

  @IsString()
  @IsOptional()
  rating?: string;

  @IsString()
  promoterId: number;
}
