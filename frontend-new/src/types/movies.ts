export type Movie = {
    id: number;
    title: string;
    type: Type;
    origin: string;
    genre: string;
    rating: string;
    description: string;
    releaseDate: Date;
    status: Status;
    promoter: User;
    images: string[];
}

export type User = {
    id: number;
    username: string;
    name: string;
    email: string;
    role: Role;
    status: string;
    movies?: Movie[] | undefined;
}

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
}

export enum Type {
    MOVIE = 'movie',
    SERIES = 'webseries',
    TV = 'telivision',
}

export enum Role {
    USER = 'user',
    PROMOTER = 'promoter',
}

