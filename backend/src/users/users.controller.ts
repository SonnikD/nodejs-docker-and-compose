import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserWishesDto } from './dto/user-wishes.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findById(@Req() req): Promise<User> {
    return await this.usersService.findOneById(req.user.id);
  }

  @Patch('me')
  async updateOne(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOneById(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.findWishes(req.user.id);
  }

  @Get(':username')
  async findByUserName(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOneByUserName(username);
  }

  @Get(':username/wishes')
  async findUserWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const { id } = await this.usersService.findOneByUserName(username);
    return await this.usersService.findWishes(id);
  }

  @Post('find')
  async findByQuery(@Param('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
