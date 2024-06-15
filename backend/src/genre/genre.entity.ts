import { Movie } from 'src/movie/movie.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class GenresModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  genre: string;

  @Column()
    description: string;
    
    @ManyToOne(() => Movie, movie => movie.genre, { cascade: true })    // Added cascade option
    @JoinColumn({ name: 'movieId' })    // Specify the foreign key column   
    movie: Movie;
}
