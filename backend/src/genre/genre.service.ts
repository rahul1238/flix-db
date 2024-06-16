import { Injectable } from "@nestjs/common";
import { Genre } from "./genre.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
    ) { }
  getAllGenre(): Promise<Genre[]> {
    return this.genreRepository.find();
  }
}