import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from '../services/book.service';
import { BookInputDto, BookSearchDto, BookUpdateDto } from '../dtos/book.dto';
import { Book } from '../entities/book.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookId')
  getOneBook(@Param('bookId') bookId: string): Promise<Book> {
    return this.booksService.findOne(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  searchBooks(@Body() search: BookSearchDto): Promise<Book[]> {
    return this.booksService.search(search);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBook(@Body() createBookDto: BookInputDto): Promise<Book> {
    return this.booksService.createBook(createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() updateBookDto: BookUpdateDto,
  ): Promise<Book> {
    return this.booksService.updateBook(bookId, updateBookDto);
  }
}
