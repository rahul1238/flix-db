import { Type } from 'src/public/common';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  title: string;

  @IsString()
  type: Type;

  @IsString()
  origin: string;

  @IsString()
  genre: string;

  @IsNumber()
  rating: string;

  @IsString()
  description: string;

  @IsDate()
  releaseDate: Date;
}
