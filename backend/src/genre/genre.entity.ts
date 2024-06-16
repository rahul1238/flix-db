import { Movie } from 'src/movie/movie.entity';
import {
  Entity,
  Column,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Movie, (movie) => movie.genre)
  movies: Movie[];
}
