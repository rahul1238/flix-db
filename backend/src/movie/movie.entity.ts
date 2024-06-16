import { Status, Type } from 'src/public/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
  ManyToMany,
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
    enum: Type,
  })
  type: Type;

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

  @ManyToOne((type) => User, (user) => user.movies)
  @JoinColumn({ name: 'promoter_id' })
  promoter: User;

  @Column()
  imageUrl: string | null;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[] | undefined;

  @ManyToOne(() => Genre, (genre) => genre.movies, { cascade: true })
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
}
