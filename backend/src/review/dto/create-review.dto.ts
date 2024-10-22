import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  headline: string;

  @IsString()
  feedback: string;

  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
