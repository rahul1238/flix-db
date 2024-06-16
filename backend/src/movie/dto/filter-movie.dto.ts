import { IsOptional, IsString } from 'class-validator';

export class FilterMoviesDto {
  @IsOptional()
  @IsString()
  genreId?: number;

  @IsOptional()
  @IsString()
  rating?: number;
}
