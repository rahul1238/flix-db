import {Entity,Column,PrimaryGeneratedColumn,OneToMany,BeforeInsert,BeforeUpdate} from 'typeorm';
import { Movie } from 'src/movie/movie.entity';
import { Role } from 'src/public/common';
import { Review } from 'src/review/review.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  resetTokenExpiry: Date | null;

  @OneToMany(() => Movie, (movie) => movie.promoter)
  movies: Movie[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
