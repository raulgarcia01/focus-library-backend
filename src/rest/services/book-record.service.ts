import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BookRecord } from '../entities/book-record.entity';
import { BooksService } from './book.service';

@Injectable()
export class BookRecordsService {
  constructor(
    @InjectRepository(BookRecord)
    private bookRecordsRepository: Repository<BookRecord>,
    private booksService: BooksService,
  ) {}

  async checkoutBook(userId: string, booksId: string[]): Promise<BookRecord[]> {
    const bookRecords = await this.bookRecordsRepository.findBy({
      userId: userId,
      bookId: In(booksId),
      bookRecord: true,
    });
    if (bookRecords.length == 0) {
      await this.booksService.updateStock(booksId, false);
      let bulkBookRecords = [];
      booksId.forEach((bookId) => {
        const record = new BookRecord();
        record.userId = userId;
        record.bookId = bookId;
        record.bookDate = new Date();
        record.bookRecord = true;
        record.returnDate = null;
        bulkBookRecords.push(record);
      });
      return await this.bookRecordsRepository.save(bulkBookRecords);
    } else {
      throw new HttpException(
        'Already have a copy of this book checkout',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async returnBook(userId: string, booksId: string[]): Promise<BookRecord[]> {
    const bookRecords = await this.bookRecordsRepository.findBy({
      userId: userId,
      bookId: In(booksId),
      bookRecord: true,
    });
    if (bookRecords.length > 0) {
      await this.booksService.updateStock(booksId, true);
      bookRecords.forEach((record) => {
        record.bookRecord = false;
        record.returnDate = new Date();
      });
    } else {
      throw new NotFoundException('Invalid books or user records');
    }
    return await this.bookRecordsRepository.save(bookRecords);
  }

  async findAllByUser(userId: string): Promise<BookRecord[]> {
    return await this.bookRecordsRepository.find({
      where: { userId },
      relations: ['book'],
    });
  }

  async findAllCheckedOutByUser(userId: string): Promise<BookRecord[]> {
    return await this.bookRecordsRepository.find({
      where: { userId: userId, bookRecord: true },
      relations: ['user', 'book'],
    });
  }
}
