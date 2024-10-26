import { Module } from '@nestjs/common';
import { GenresController } from './genre.controller';
import { GenreService } from './genre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenresController],
  providers: [GenreService],
  exports: [GenreService, TypeOrmModule],
})
export class GenresModule {}
