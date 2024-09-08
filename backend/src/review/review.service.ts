import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Movie } from '../movie/movie.entity';
import { User } from 'src/user/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new review
  async createReview(createReviewDto: CreateReviewDto): Promise<{ success: boolean; message: string; data?: Review }> {
    const { userId, movieId, ...reviewData } = createReviewDto;

    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const movie = await this.movieRepository.findOne({ where: { id: movieId } });
      if (!movie) {
        throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
      }

      const review = this.reviewRepository.create({ ...reviewData, user, movie });
      const savedReview = await this.reviewRepository.save(review);

      return {
        success: true,
        message: 'Review added successfully',
        data: instanceToPlain(savedReview) as Review,
      };
    } catch (error) {
      this.handleServiceError(error, 'adding review');
    }
  }

  // Fetch reviews for a specific movie
  async getMovieReviews(movieId: number): Promise<{ success: boolean; data?: Review[]; message: string }> {
    try {
      const movieReviews = await this.reviewRepository.find({
        where: { movie: { id: movieId } },
        relations: ['movie', 'user'], // Include user relation if needed for context
      });

      if (!movieReviews.length) {
        return {
          success: false,
          data: [],
          message: 'No reviews found for this movie',
        };
      }

      return {
        success: true,
        data: movieReviews,
        message: 'Reviews fetched successfully',
      };
    } catch (error) {
      this.handleServiceError(error, 'fetching movie reviews');
    }
  }

  // Handle service errors uniformly
  private handleServiceError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      `An error occurred while ${operation}. Please try again later.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
