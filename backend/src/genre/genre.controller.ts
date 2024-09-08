import { Body, Controller, Get, Post, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';

@Controller('api/genres')
export class GenresController {
  constructor(private readonly genreService: GenreService) {}

  // Fetch all genres
  @Get()
  async getAllGenres(): Promise<{ success: boolean; data: Genre[]; message: string }> {
    try {
      const genres = await this.genreService.getAllGenre();
      return {
        success: true,
        data: genres,
        message: 'Genres fetched successfully',
      };
    } catch (error) {
      this.handleControllerError(error, 'fetching all genres');
    }
  }

  // Create a new genre
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGenre(
    @Body() createGenreDto: CreateGenreDto,
  ): Promise<{ success: boolean; data?: Genre; message: string }> {
    try {
      const genre = await this.genreService.createGenre(createGenreDto);
      return {
        success: true,
        data: genre,
        message: 'Genre created successfully',
      };
    } catch (error) {
      this.handleControllerError(error, 'creating genre');
    }
  }

  // Handle controller-level errors uniformly
  private handleControllerError(error: any, operation: string): never {
    console.error(`Error while ${operation}:`, error);
    throw new HttpException(
      { success: false, message: `An error occurred while ${operation}. Please try again later.` },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
