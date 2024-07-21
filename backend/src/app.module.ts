import { Module } from "@nestjs/common";
import { MoviesModule } from "./movie/movie.module";
import { GenresModule } from "./genre/genre.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { User } from "./user/user.entity";
import { ReviewModule } from "./review/review.module";
import { RolesGuard } from "./auth/roles.guard";

@Module({
	imports: [
		MoviesModule,
		GenresModule,
		UserModule,
		AuthModule,

		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "localhost",
			port: 5432,
			username: process.env.DB_USER_NAME,
			password: process.env.DB_USER_PASSWORD,
			database: process.env.DB_DATABASE,
			autoLoadEntities: true,
			synchronize: true,
			entities: [User, __dirname + "/**/*.entity{.ts,.js}"],
		}),
		ReviewModule,
	],
	controllers: [AuthController],
	providers: [RolesGuard],
})
export class AppModule {}
