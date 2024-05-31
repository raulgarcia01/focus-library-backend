import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { BooksController } from './controllers/book.controller';
import { BookRecordsController } from './controllers/book-records.controller';
import { UsersService } from './services/user.service';
import { BooksService } from './services/book.service';
import { BookRecordsService } from './services/book-record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { BookRecord } from './entities/book-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, BookRecord])],
  controllers: [UsersController, BooksController, BookRecordsController],
  providers: [UsersService, BooksService, BookRecordsService],
})
export class RestModule {}
