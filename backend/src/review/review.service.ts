import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Movie } from "../movie/movie.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<{success?: boolean, message?: string, data?: Review}> {
   try {
     const { rating, feedback, movieId } = createReviewDto;
     console.log(rating);
     
     const movie = await this.movieRepository.findOne({where: {id: movieId}});
 
     if (!movie) {
       throw new Error("Movie not found");
     }
 
     const review = new Review();
     review.rating = Number(rating);
     review.feedback = feedback;
     review.movie = movie;
 
     const reviews = await this.reviewRepository.save(review);

     return {
        success: true,
        message: "Reviews added succesfully",
        data: reviews,
     }
   } catch (error) {
    return {
        success: false,
        message: "Cannot get the movie"
    }
   }
  }

  async getMovieReviews(movieId: number): Promise<{success?: boolean, data?: Review[], message?: string}> {
    try {
        const moviesReview =  await this.reviewRepository.find({
          where: { movie: { id: movieId } },
          relations: ['movie'],
        });
    
        if(moviesReview.length === 0) {
            return {
                success: false,
                data: [],
                message: "Movies review did not found",
            }
        }
    
        return {
            success: true,
            data: moviesReview,
            message: "Movies Fetched Successfuly"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error while getting movies review"
        }
    }
  }
}