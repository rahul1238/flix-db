import { Status, Type } from 'src/public/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { IsOptional } from 'class-validator';

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
  genre: string;

  @Column({ default: 0 })
  rating: string;

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
}
