import {
  IsNotEmpty,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Status, movieType } from 'src/public/common';
import { Type } from 'class-transformer';
import { IsString, IsEnum, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: movieType;

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
