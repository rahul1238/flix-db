import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  feedback: string;

  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
