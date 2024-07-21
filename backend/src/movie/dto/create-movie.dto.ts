import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Status, movieType } from 'src/public/common';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: movieType;

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
  @Type(() => File)
  image?: Express.Multer.File[];
}
