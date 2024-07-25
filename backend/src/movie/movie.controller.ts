import {Body,Controller,Get,Post,Query,Patch,Param,UseGuards,Req,UploadedFiles,UseInterceptors,HttpException,HttpStatus,ParseIntPipe} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMoviesDto } from './dto/filter-movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/public/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { instanceToPlain } from 'class-transformer';

@Controller('api/movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService,
    private readonly uploadService: UploadService,
  ) {}

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
  @UseInterceptors(FilesInterceptor('image'))
  async createMovie(@UploadedFiles() images: Express.Multer.File[],@Body() createMovieDto: CreateMovieDto,@Req() req ): Promise<{ success: boolean; data?: Movie; message: string }> {
    if (![Role.PROMOTER, Role.ADMIN].includes(req.user.role)) {
      throw new HttpException(
        { success: false, message: 'Not authorized to create a movie' },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadPromises = images.map(image => this.uploadService.uploadImage(image));
        const uploadedImagePaths = await Promise.all(uploadPromises);
        imageUrls.push(...uploadedImagePaths);
      }

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

  @Patch(':id')
  async updateMovie(@Param('id') movieId: number,@Body() updateMovieDto: UpdateMovieDto,): Promise<{ success?: boolean; data?: Movie; message?: string }> {
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

  @Get('search')
  async searchMovies(@Query('query') query: string): Promise<{ success: boolean; data: Movie[]; message: string }> {
    const movies = await this.movieService.searchMovies(query);
    return { success: true, data: movies, message: 'Search results fetched successfully!' };
  }

  @Get(':id')
  async getMovieById(@Param('id', ParseIntPipe) movieId: number): Promise<{ success: boolean; data?: Movie; message: string }> {
    if (!movieId) {
      return {
        success: false,
        message: 'Please provide movie id',
      };
    }

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
      return {
        success: false,
        message: 'Error while fetching movie',
      };
    }
  }

}
