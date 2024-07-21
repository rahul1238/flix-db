import { Module } from '@nestjs/common';
import { MoviesController } from './movie.controller';
import { MoviesService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Genre } from 'src/genre/genre.entity';
import { User } from 'src/user/user.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie,Genre,User]),UploadModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}