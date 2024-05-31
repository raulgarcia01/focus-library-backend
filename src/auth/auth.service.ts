import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/rest/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/rest/entities/user.entity';
import { jwtConstants } from './auth.constants';
import { AuthResponseDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponseDTO> {
    const payload = {
      sub: user.id,
      userName: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    const response = new AuthResponseDTO();
    response.accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
    return response;
  }
}
