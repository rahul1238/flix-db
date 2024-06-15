import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMoviesDto } from './dto/filter-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    return await this.moviesRepository.find();
  }

  //filter movie by genere
  async getMoviesByGenere(genre: string): Promise<Movie[]> {
    return await this.moviesRepository.find({ where: { genre } });
  }

  //filter movie by rating and genre
  async filterMovies(filterMovieDto: FilterMoviesDto): Promise<Movie[]> {
    const { rating, genre } = filterMovieDto;
    const queryBuilder = this.moviesRepository.createQueryBuilder('movie');

    if (rating) {
      queryBuilder.andWhere('movie.rating = :rating', { rating });
    }

    if (genre) {
      queryBuilder.andWhere('movie.genre = :genre', { genre });
    }

    return queryBuilder.getMany();
  }

  //create Movie
  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie | null> {
    try {
      const movie = this.moviesRepository.create(createMovieDto);
      return await this.moviesRepository.save(movie);
    } catch (error) {
      console.error('Error while creating movie:', error);
      return null;
    }
  }

  //update movie
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
}
