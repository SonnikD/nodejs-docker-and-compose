import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  async create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findOneById(id);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return await this.wishlistsService.update(
      id,
      req.user.id,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req): Promise<Wishlist> {
    return await this.wishlistsService.remove(id, req.user.id);
  }
}
