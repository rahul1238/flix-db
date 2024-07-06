import {Body,Controller,Get,Post,Query,Patch,Param,UseGuards, Req,} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMoviesDto } from './dto/filter-movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/public/common';

@Controller('api/movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  @Get()
  async getAllMovies(): Promise<{ movies: Movie[]; message: string }> {
    const movies = await this.movieService.getAllMovies();
    if (movies.length !== 0) {
      return {
        movies,
        message: 'all movies are fetched successfully!',
      };
    }
    return {
      message: 'No movies found in the database, Please Add them',
      movies,
    };
  }

  @Get('filter')
  async filterMovies(
    @Query() filterMovieDto: FilterMoviesDto,
  ): Promise<{ movies: Movie[]; message: string }> {
    try {
      const movies = await this.movieService.filterMovies(filterMovieDto);
      return {
        movies,
        message: 'Movies filtered successfully',
      };
    } catch (error) {
      console.error('Error while filtering movies:', error);
      return {
        movies: [],
        message: 'Error while filtering movies',
      };
    }
  }

  //add  movie
  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.PROMOTER, Role.ADMIN)
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @Req() req,
  ): Promise<{ succes?: boolean; data?: Movie; message?: string }> {
    try {
      const {
        title,
        type,
        origin,
        description,
        genreId,
        rating,
        releaseDate,
        status,
        imageUrl,
        userId,
      } = createMovieDto;
      const data = {
        title,
        type,
        origin,
        description,
        genreId,
        rating,
        releaseDate,
        status,
        promoter: req.user.sub,
        imageUrl,
        userId,
      };
      console.log(data);
      console.log(req.user);
      if (req.user.role !== Role.PROMOTER && req.user.role !== Role.ADMIN) {
        return {
          succes: false,
          message: 'You are not allowed to create movie .',
        };
      }
      const addedMovie = await this.movieService.createMovie(data);

      if (!addedMovie) {
        return {
          succes: false,
          message: 'error while creating the entry.',
        };
      }

      return {
        succes: true,
        data: addedMovie,
        message: 'Movie Added Successfully!',
      };
    } catch (error) {
      return {
        succes: false,
        message: 'Error while creating entry in database.',
      };
    }
  }

  @Patch(':id')
  async updateMovie(
    @Param('id') movieId: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<{ success?: boolean; data?: Movie; message?: string }> {
    if (!movieId) {
      return {
        success: false,
        message: 'Please provide movie id',
      };
    }

    try {
      const movie = await this.movieService.updateMovie(
        movieId,
        updateMovieDto,
      );
      if (!movie) {
        return {
          success: false,
          message: 'Error while updating movie',
        };
      }

      return {
        success: true,
        data: movie,
        message: 'Movie Updated Successfully!',
      };
    } catch (error) {
      console.error('Error while updating movie:', error);
      return {
        success: false,
        message: 'Error while updating movie',
      };
    }
  }
}
