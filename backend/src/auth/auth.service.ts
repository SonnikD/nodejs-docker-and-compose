import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async auth(user: User): Promise<SigninUserResponseDto> {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<SignupUserResponseDto> {
    const user = await this.usersService.findOneByUserNamePass(username);
    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (user && isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Неверный логин или пароль');
  }
}
