import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MoviesModule } from './movie/movie.module';
import { GenresModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { UploadModule } from './upload/upload.module';
import { AuthController } from './auth/auth.controller';
import { RolesGuard } from './auth/roles.guard';
import { User } from './user/user.entity';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MoviesModule,
    GenresModule,
    UserModule,
    AuthModule,
    UploadModule,
    ReviewModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [User, __dirname + '/**/*.entity{.ts,.js}'],
      ssl: { rejectUnauthorized: false },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: (() => {
          const service = configService.get<string>('MAIL_SERVICE'); // e.g. 'gmail'
            const user = configService.get<string>('MAIL_USER');
            const pass = configService.get<string>('MAIL_PASSWORD') || configService.get<string>('MAIL_PASS');
          if (service) {
            if (!user || !pass) {
              console.warn(`[Mailer] MAIL_SERVICE=${service} specified but MAIL_USER / MAIL_PASSWORD missing.`);
            }
            return { service, auth: user && pass ? { user, pass } : undefined };
          }
          const host = configService.get<string>('MAIL_HOST');
          const portRaw = configService.get<string>('MAIL_PORT');
          const port = portRaw ? parseInt(portRaw, 10) : 587;
          const transport: any = { host, port, secure: port === 465 };
          // Gmail convenience if host contains gmail
          if (host && /gmail\.com$/i.test(host)) {
            transport.secure = false; // STARTTLS on 587
            transport.port = 587;
            transport.requireTLS = true;
          }
          if (user && pass) {
            transport.auth = { user, pass };
          } else {
            console.warn('[Mailer] MAIL_USER or MAIL_PASSWORD not set. Attempting unauthenticated / relay connection.');
          }
          return transport;
        })(),
        defaults: (() => {
          const from = configService.get<string>('MAIL_FROM') || configService.get<string>('MAIL_USER');
          return { from: from ? `"No Reply" <${from}>` : undefined };
        })(),
        template: {
          dir: join(__dirname, '..', 'public', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [RolesGuard,UserService],
})
export class AppModule {}
