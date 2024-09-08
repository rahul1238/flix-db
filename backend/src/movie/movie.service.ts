import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMoviesDto } from './dto/filter-movie.dto';
import { Genre } from 'src/genre/genre.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  // Fetch all movies
  async getAllMovies(): Promise<Movie[]> {
    try {
      return await this.moviesRepository.find();
    } catch (error) {
      this.handleDatabaseError(error, 'fetching all movies');
    }
  }

  // Filter movies by rating and genre
  async filterMovies(filterMovieDto: FilterMoviesDto): Promise<Movie[]> {
    const { rating, genreId } = filterMovieDto;
    try {
      const queryBuilder = this.moviesRepository.createQueryBuilder('movie');

      if (rating) {
        queryBuilder
          .innerJoin('movie.reviews', 'review')
          .andWhere('review.rating = :rating', { rating });
      }

      if (genreId) {
        queryBuilder.andWhere('movie.genre = :genre', { genreId });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.handleDatabaseError(error, 'filtering movies');
    }
  }

  // Create a new movie
  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreIds, promoterId, ...movieData } = createMovieDto;

    try {
      const genres = await this.genreRepository.findBy({ id: In(genreIds) });
      if (genres.length === 0) {
        throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
      }

      const promoter = await this.userRepository.findOne({
        where: { id: promoterId },
      });
      if (!promoter) {
        throw new HttpException('Promoter not found', HttpStatus.NOT_FOUND);
      }

      const movie = this.moviesRepository.create({
        ...movieData,
        genres,
        promoter,
      });

      return await this.moviesRepository.save(movie);
    } catch (error) {
      this.handleDatabaseError(error, 'creating movie');
    }
  }

  // Update an existing movie
  async updateMovie(
    movieId: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id: movieId },
      });
      if (!movie) {
        throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
      }

      this.moviesRepository.merge(movie, updateMovieDto);
      return await this.moviesRepository.save(movie);
    } catch (error) {
      this.handleDatabaseError(error, 'updating movie');
    }
  }

  // Fetch a single movie by ID
  async getMovieById(movieId: number): Promise<Movie> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id: movieId },
        relations: ['genres', 'promoter'],
      });

      if (!movie) {
        throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
      }

      return movie;
    } catch (error) {
      this.handleDatabaseError(error, 'fetching movie by ID');
    }
  }

  // Search movies by title
  async searchMovies(query: string): Promise<Movie[]> {
    try {
      return await this.moviesRepository
        .createQueryBuilder('movie')
        .where('movie.title ILIKE :query', { query: `%${query}%` })
        .getMany();
    } catch (error) {
      this.handleDatabaseError(error, 'searching movies');
    }
  }

  // Find movies by promoter ID
  async findMoviesByPromoterId(promoterId: number): Promise<Movie[]> {
    try {
      return await this.moviesRepository.find({
        where: { promoter: { id: promoterId } },
        relations: ['promoter', 'genres', 'reviews'],
      });
    } catch (error) {
      this.handleDatabaseError(error, 'finding movies by promoter ID');
    }
  }

  // Handle database errors consistently
  private handleDatabaseError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      `An error occurred while ${operation}. Please try again later.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
