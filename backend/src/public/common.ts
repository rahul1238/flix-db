export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY
}
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum movieType {
  MOVIE = 'movie',
  SERIES = 'webseries',
  TV = 'telivision',
}

export enum Role {
  USER = 'user',
  PROMOTER = 'promoter',
  ADMIN = 'admin',
}
