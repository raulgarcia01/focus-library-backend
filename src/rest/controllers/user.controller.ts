import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { UserInputDto, UserUpdateDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getOneUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() createUserDto: UserInputDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UserUpdateDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
