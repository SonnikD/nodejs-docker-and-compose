import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User])],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
