import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInputDto, UserUpdateDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(userInputDto: UserInputDto): Promise<User> {
    try {
      const user = this.usersRepository.create(userInputDto);
      const hashPassword = await bcrypt.hash(user.password, 10);
      user.password = hashPassword;
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error(`Èrror message: ${error}`);
      throw new HttpException(
        `Error message: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    userId: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<User> {
    try {
      let user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        user.firstName = userUpdateDto.firstName;
        user.lastName = userUpdateDto.lastName;
        user.email = userUpdateDto.email;
        return await this.usersRepository.save(user);
      } else {
        throw new NotFoundException('Error to find a user ID');
      }
    } catch (error) {
      console.error(`Error message: ${error}`);
      throw new HttpException(
        `Error message: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Error to find a user ID');
    return user;
  }

  async findByUserName(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: username, state: 'ACTIVE' },
    });
    if (!user) throw new NotFoundException('Error to find a username');
    return user;
  }
}
