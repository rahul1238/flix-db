import { movieType } from 'src/public/common';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  title: string;

  @IsString()
  type: movieType;

  @IsString()
  origin: string;

  @IsString()
  genreId: number;

  @IsNumber()
  rating: string;

  @IsString()
  description: string;

  @IsDate()
  releaseDate: Date;
}
