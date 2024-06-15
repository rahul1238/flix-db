import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReview(
    @Body() createReatingDto: CreateReviewDto,
  ): Promise<{ success?: boolean; data?: Review }> {
    return await this.reviewService.createReview(createReatingDto);
  }

  @Get('/:movieId')
  async getMovieReview(
    @Param('movieId') movieId: number,
  ): Promise<{ success?: boolean; data?: Review[] }> {
    return await this.reviewService.getMovieReviews(movieId);
  }
}
