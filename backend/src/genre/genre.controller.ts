import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';

@Controller('api/genres')
export class GenresController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  getAllgenere(): string {
    return 'all genere fecthed successfully';
  }

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
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
