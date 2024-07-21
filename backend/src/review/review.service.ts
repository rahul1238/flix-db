import { Injectable } from '@nestjs/common';
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
    private reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<{ success?: boolean; message?: string; data?: Review }> {
    try {
      const { userId, movieId, ...reviewData } = createReviewDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });

      const movie = await this.movieRepository.findOne({where: { id: movieId }});
      const review = this.reviewRepository.create({...reviewData,user,movie});
      const reviews = await this.reviewRepository.save(review);

      return {
        success: true,
        message: 'Review added succesfully',
        data: instanceToPlain(reviews) as Review
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error occured while adding reviews',
      };
    }
  }

  async getMovieReviews(
    movieId: number,
  ): Promise<{ success?: boolean; data?: Review[]; message?: string }> {
    try {
      const moviesReview = await this.reviewRepository.find({
        where: { movie: { id: movieId } },
        relations: ['movie'],
      });

      if (moviesReview.length === 0) {
        return {
          success: false,
          data: [],
          message: 'Movies review did not found',
        };
      }

      return {
        success: true,
        data: moviesReview,
        message: 'Movies Fetched Successfuly',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error while getting movies review',
      };
    }
  }
}
