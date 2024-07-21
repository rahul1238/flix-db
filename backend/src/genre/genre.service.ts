import { Injectable,InternalServerErrorException } from "@nestjs/common";
import { Genre } from "./genre.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGenreDto } from "./dto/create-genre.dto";

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
    ) { }
  getAllGenre(): Promise<Genre[]> {
    return this.genreRepository.find();
  }

  async createGenre(createGenreDto: CreateGenreDto): Promise<Genre> {
    try {
      const genre = this.genreRepository.create(createGenreDto);
      return await this.genreRepository.save(genre);
    } catch (error) {
      throw new InternalServerErrorException('Error creating genre');
    }
  }
}