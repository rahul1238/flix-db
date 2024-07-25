import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,In } from 'typeorm';
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

  async getAllMovies(): Promise<Movie[]> {
    return await this.moviesRepository.find();
  }

  async filterMovies(filterMovieDto: FilterMoviesDto): Promise<Movie[]> {
    const { rating, genreId } = filterMovieDto;
    const queryBuilder = this.moviesRepository.createQueryBuilder('movie');

    if (rating) {
      queryBuilder
        .innerJoin('movie.reviews', 'review')
        .andWhere('review.rating = :rating', { rating });
    }

    if (genreId) {
      queryBuilder.andWhere('movie.genre = :genre', { genreId });
    }

    return queryBuilder.getMany();
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreIds, promoterId, ...movieData } = createMovieDto;

    const genres = await this.genreRepository.findBy({ id: In( genreIds) });
    if (!genres) {
      throw new Error('Genre not found');
    }

    const promoter = await this.userRepository.findOne({
      where: { id: promoterId },
    });
    if (!promoter) {
      throw new Error('Promoter not found');
    }

    const movie = this.moviesRepository.create({
      ...movieData,
      genres,
      promoter,
    });

    return await this.moviesRepository.save(movie);
  }

  async updateMovie(
    movieId: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie | null> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id: movieId },
      });
      if (!movie) {
        console.error('Movie not found');
        return null;
      }
      this.moviesRepository.merge(movie, updateMovieDto);
      return await this.moviesRepository.save(movie);
    } catch (error) {
      console.error('Error while updating movie:', error);
      return null;
    }
  }

  async getMovieById(movieId: number): Promise<Movie | null> {
    try {
      return await this.moviesRepository.findOne({where: { id: movieId },relations: ['genres', 'promoter']});
    } catch (error) {
      console.error('Error while fetching movie:', error);
      return null;
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    return this.moviesRepository
      .createQueryBuilder('movie')
      .where('movie.title ILIKE :query', { query: `%${query}%` })
      .getMany();
  }
}
