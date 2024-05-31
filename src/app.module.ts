import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RestModule } from './rest/rest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './rest/entities/user.entity';
import { Book } from './rest/entities/book.entity';
import { BookRecord } from './rest/entities/book-record.entity';
import { AuthService } from './auth/auth.service';
import { UsersService } from './rest/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'sandbox',
      entities: [User, Book, BookRecord],
      synchronize: true,
    }),
    AuthModule,
    RestModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService, JwtService],
})
export class AppModule {}
