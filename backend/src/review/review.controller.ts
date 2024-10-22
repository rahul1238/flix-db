import { Body, Controller, Get, Param, Post, Req, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Create a new review
  @Post()
  @UseGuards(AuthGuard)
  async createReview(
    @Body() reviewData: CreateReviewDto,
    @Req() req,
  ): Promise<{ success: boolean; data?: Review; message: string }> {
    try {
      reviewData.userId = req.user.sub;
      const result = await this.reviewService.createReview(reviewData);
      return result;
    } catch (error) {
      this.handleControllerError(error, 'creating review');
    }
  }

  // Fetch reviews for a specific movie
  @Get('/:movieId')
  async getMovieReview(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<{ success: boolean; data?: Review[]; message: string }> {
    try {
      return await this.reviewService.getMovieReviews(movieId);
    } catch (error) {
      this.handleControllerError(error, 'fetching movie reviews');
    }
  }

  // Handle controller-level errors uniformly
  private handleControllerError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      `An error occurred while ${operation}. Please try again later.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
