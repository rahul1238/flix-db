import { Status, movieType } from 'src/public/common';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

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

  @IsArray()
  @IsNumber({}, { each: true })
  genreIds: number[];

  @IsString()
  @IsOptional()
  rating?: string;

  @IsNumber()
  promoterId: number;

  @IsString()
  @IsOptional()
  director?: string;
}
