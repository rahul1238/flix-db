export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
};
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum movieType {
  MOVIE = 'movie',
  SERIES = 'series',
  TV = 'television',
  DOCUMENTARY = 'documentary',
  ANIME = 'anime',
  SHORT = 'short',
  SPECIAL = 'special',
}

export enum Role {
  USER = 'user',
  PROMOTER = 'promoter',
  ADMIN = 'admin',
}
