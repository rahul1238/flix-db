import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from 'src/movie/movie.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' }) 
    rating: number;

    @Column({ type: 'text' })
    feedback: string;

    @ManyToOne(() => Movie, movie => movie.rating, { cascade: true }) 
    @JoinColumn({ name: 'movieId' }) 
    movie: Movie;
}
