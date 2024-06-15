import { Module } from '@nestjs/common';
import { GenresController } from './genre.controller';

@Module({
  controllers: [GenresController],
})
export class GenresModule {}