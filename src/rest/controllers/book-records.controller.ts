import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookRecordsService } from '../services/book-record.service';
import { BookRecord } from '../entities/book-record.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('book-records')
export class BookRecordsController {
  constructor(private readonly bookRecordsService: BookRecordsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkoutBooks(
    @Body() checkoutDto: { userId: string; booksId: string[] },
  ): Promise<BookRecord[]> {
    return this.bookRecordsService.checkoutBook(
      checkoutDto.userId,
      checkoutDto.booksId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('return')
  returnBooks(
    @Body() checkoutDto: { userId: string; booksId: string[] },
  ): Promise<BookRecord[]> {
    return this.bookRecordsService.returnBook(
      checkoutDto.userId,
      checkoutDto.booksId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('records/:userId')
  findAllByUser(@Param('userId') userId: string): Promise<BookRecord[]> {
    return this.bookRecordsService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checked-out/records/:userId')
  findAllCheckedOut(@Param('userId') userId: string): Promise<BookRecord[]> {
    return this.bookRecordsService.findAllCheckedOutByUser(userId);
  }
}
