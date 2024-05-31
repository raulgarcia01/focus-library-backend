import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { BookInputDto, BookSearchDto, BookUpdateDto } from '../dtos/book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private dataSource: DataSource,
  ) {}

  createBook(bookData: BookInputDto): Promise<Book> {
    try {
      const book = this.booksRepository.create(bookData);
      return this.booksRepository.save(book);
    } catch (error) {
      console.error(`Error message: ${error}`);
      throw new HttpException(
        `Error message: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBook(bookId: string, bookData: BookUpdateDto): Promise<Book> {
    try {
      let book = await this.booksRepository.findOne({
        where: { id: bookId },
      });
      if (book) {
        book.author = bookData.author;
        book.title = bookData.title;
        book.publishedYear = bookData.publishedYear;
        book.genre = bookData.genre;
        book.stock = bookData.stock;
        return this.booksRepository.save(book);
      } else {
        throw new NotFoundException('Error to find a book ID');
      }
    } catch (error) {
      console.error(`Error message: ${error}`);
      throw new HttpException(
        `Error message: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Book[]> {
    return await this.booksRepository.find();
  }

  async findOne(bookId: string): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Error to find a book ID');
    return book;
  }

  async updateStock(booksId: string[], returned: boolean): Promise<Book[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let books = await this.booksRepository.findBy({ id: In(booksId) });
      if (books.length > 0) {
        if (returned) {
          books.forEach((book) => (book.stock += 1));
        } else {
          books.forEach((book) => (book.stock -= 1));
        }
        await queryRunner.manager.save(books);
        await queryRunner.commitTransaction();
        return books;
      } else {
        throw new NotFoundException('Error to find a books IDs');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error message: ${error}`);
      throw new HttpException(
        `Error message: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async search(search: BookSearchDto): Promise<Book[]> {
    const query = this.booksRepository
      .createQueryBuilder('book')
      .where(' 0 = 0');
    if (search?.title)
      query.andWhere('book.title ILIKE :title', { title: `%${search.title}%` });
    if (search?.author)
      query.andWhere('book.author ILIKE :author', {
        author: `%${search.author}%`,
      });
    if (search?.genre)
      query.andWhere('book.genre ILIKE :genre', { genre: `%${search.genre}%` });
    return await query.getMany();
  }
}
