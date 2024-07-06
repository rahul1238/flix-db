import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Status, Type } from 'src/public/common';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: Type;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  genreId: number;

  @IsNotEmpty()
  @IsNumber()
  rating: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  releaseDate: Date;

  @IsString()
  status: Status;

  @IsOptional()
  @IsString({ each: true })
  imageUrl?: string[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
