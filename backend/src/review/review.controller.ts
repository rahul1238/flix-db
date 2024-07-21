import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReview(@Body() reviewData: CreateReviewDto, @Req() req): Promise<{ success?: boolean; data?: Review }> {
    reviewData.userId = req.user.sub;
    return await this.reviewService.createReview(reviewData);
  }

  @Get('/:movieId')
  async getMovieReview(@Param('movieId') movieId: number): Promise<{ success?: boolean; data?: Review[] }> {
    return await this.reviewService.getMovieReviews(movieId);
  }
}
