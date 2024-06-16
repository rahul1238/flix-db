import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Movie } from 'src/movie/movie.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  feedback: string;

  @ManyToOne(() => Movie, (movie) => movie.reviews, { cascade: true })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @ManyToOne(() => User, (user) => user.reviews, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
