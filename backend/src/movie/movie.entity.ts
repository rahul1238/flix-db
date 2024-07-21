import { Status,movieType } from 'src/public/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Review } from 'src/review/review.entity';
import { Genre } from 'src/genre/genre.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({
    type: 'enum',
    enum: movieType,
  })
  type: movieType;

  @Column()
  origin: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.movies)
  @JoinColumn({ name: 'promoter_id' })
  promoter: User;

  @Column('simple-array', { nullable: true })
  imageUrl: string[] | null;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[] | undefined;

  @ManyToOne(() => Genre, (genre) => genre.movies)
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
}
