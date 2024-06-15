import { Movie } from 'src/movie/movie.entity';
import { Role } from 'src/public/common';
import { Entity,Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ unique: true})
  email: string;

  @Column({type:'enum',enum:Role,default:Role.USER})
    role: Role;

  @Column()
  password: string;

  @Column({ default: 'active'} )
  status: string;

  @OneToMany(type => Movie, movie=>movie.promoter)
  movies?: Movie[] | undefined;
}



