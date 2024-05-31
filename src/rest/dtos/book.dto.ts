import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CommonState } from '../enums/user.enum';

export class BookInputDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsInt()
  @IsNotEmpty()
  publishedYear: number;

  @IsInt()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsEnum(CommonState)
  state: string;
}

export class BookUpdateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsInt()
  @IsNotEmpty()
  publishedYear: number;

  @IsInt()
  @IsNotEmpty()
  stock: number;
}

export class BookSearchDto {
  title: string;
  author: string;
  genre: string;
}
