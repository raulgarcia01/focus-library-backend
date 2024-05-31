import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BookRecord } from './book-record.entity';
import { Expose } from 'class-transformer';
import { CommonState } from '../enums/user.enum';

@Expose()
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column('smallint')
  publishedYear: number;

  @Column({ length: 255 })
  genre: string;

  @Column('smallint', { nullable: true })
  stock: number;

  @Column({ type: 'enum', enum: CommonState, nullable: true })
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => BookRecord, (bookRecord) => bookRecord.book)
  bookRecords: BookRecord[];
}
