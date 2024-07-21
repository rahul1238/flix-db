import { Movie } from 'src/movie/movie.entity';
import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}
