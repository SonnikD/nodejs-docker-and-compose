import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import { LocalGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req): Promise<SigninUserResponseDto> {
    return await this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    return await this.usersService.createUser(createUserDto);
  }
}
