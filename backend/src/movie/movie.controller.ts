import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMoviesDto } from './dto/filter-movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/public/common';
import { FilesInterceptor } from '@nestjs/platform-express';

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  path?: string;
}
import { UploadService } from 'src/upload/upload.service';
import { instanceToPlain } from 'class-transformer';

@Controller('api/movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService,
    private readonly uploadService: UploadService,
  ) {}

  // Fetch all movies or by promoter ID
  @Get()
  async getMovies(
    @Query('promoterId') promoterId?: number,
  ): Promise<{ success: boolean; movies: Movie[]; message: string }> {
    try {
      const movies = promoterId
        ? await this.movieService.findMoviesByPromoterId(promoterId)
        : await this.movieService.getAllMovies();
      const message = promoterId
        ? 'Movies fetched successfully!'
        : 'All movies fetched successfully!';
      return { success: true, movies, message };
    } catch (error) {
      console.error('Error while fetching movies:', error);
      return {
        success: false,
        movies: [],
        message: 'Error while fetching movies',
      };
    }
  }

  // Fetch movies based on filters
  @Get('filter')
  async filterMovies(
    @Query() filterMovieDto: FilterMoviesDto,
  ): Promise<{ movies: Movie[]; message: string }> {
    try {
      const movies = await this.movieService.filterMovies(filterMovieDto);
      return { movies, message: 'Movies filtered successfully' };
    } catch (error) {
      console.error('Error while filtering movies:', error);
      return { movies: [], message: 'Error while filtering movies' };
    }
  }

  // Search movies by query
  @Get('search')
  async searchMovies(
    @Query('query') query: string,
  ): Promise<{ success: boolean; data: Movie[]; message: string }> {
    try {
      const movies = await this.movieService.searchMovies(query);
      return {
        success: true,
        data: movies,
        message: 'Search results fetched successfully!',
      };
    } catch (error) {
      console.error('Error while searching movies:', error);
      return {
        success: false,
        data: [],
        message: 'Error while searching movies',
      };
    }
  }

  // Fetch a single movie by ID
  @Get(':id')
  async getMovieById(
    @Param('id', ParseIntPipe) movieId: number,
  ): Promise<{ success: boolean; data?: Movie; message: string }> {
    try {
      const movie = await this.movieService.getMovieById(movieId);
      if (!movie) {
        return {
          success: false,
          message: 'No movie found with the provided id',
        };
      }
      return {
        success: true,
        data: instanceToPlain(movie) as Movie,
        message: 'Movie fetched successfully!',
      };
    } catch (error) {
      console.error('Error while fetching movie:', error);
      return { success: false, message: 'Error while fetching movie' };
    }
  }

  // Create a new movie
  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.PROMOTER, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('image'))
  async createMovie(
    @UploadedFiles() images: UploadedFileType[],
    @Body() createMovieDto: CreateMovieDto,
    @Req() req,
  ): Promise<{ success: boolean; data?: Movie; message: string }> {
    if (![Role.PROMOTER, Role.ADMIN].includes(req.user.role)) {
      throw new HttpException(
        'Not authorized to create a movie',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const imageUrls = await Promise.all(
        images.map((image) => this.uploadService.uploadImage(image)),
      );
      createMovieDto.promoterId = req.user.sub;
      createMovieDto.imageUrl = imageUrls;

      const addedMovie = await this.movieService.createMovie(createMovieDto);
      return {
        success: true,
        data: instanceToPlain(addedMovie) as Movie,
        message: 'Movie added successfully!',
      };
    } catch (error) {
      console.error('Error while creating movie:', error);
      return {
        success: false,
        message: error.message || 'Error while creating entry in database.',
      };
    }
  }

  // Update an existing movie
  @Patch(':id')
  async updateMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<{ success: boolean; data?: Movie; message?: string }> {
    try {
      const movie = await this.movieService.updateMovie(
        movieId,
        updateMovieDto,
      );
      if (!movie) {
        return { success: false, message: 'Error while updating movie' };
      }
      return {
        success: true,
        data: movie,
        message: 'Movie Updated Successfully!',
      };
    } catch (error) {
      console.error('Error while updating movie:', error);
      return { success: false, message: 'Error while updating movie' };
    }
  }
}
