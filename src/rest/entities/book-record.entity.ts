import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';
import { Expose } from 'class-transformer';

@Expose()
@Entity('book_record')
export class BookRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  bookId: string;

  @Column()
  bookRecord: boolean;

  @Column()
  bookDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @ManyToOne(() => User, (user) => user.bookRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Book, (book) => book.bookRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  book: Book;
}
