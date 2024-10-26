import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { Movie } from '../movie/movie.entity';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { User } from 'src/user/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Movie, Review, User]), AuthModule],
})
export class ReviewModule {}
