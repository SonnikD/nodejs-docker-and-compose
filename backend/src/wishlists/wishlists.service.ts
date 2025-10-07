import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(wishListId: number) {
    const wishList = await this.wishListRepository.findOne({
      relations: ['owner', 'items'],
      where: { id: wishListId },
    });

    if (!wishList) {
      throw new NotFoundException('Список желаний не найден');
    }
    return wishList;
  }

  async findAll() {
    return await this.wishListRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async remove(wishListId: number, userId: number): Promise<Wishlist> {
    const wishList = await this.findOneById(wishListId);

    if (userId !== wishList.owner.id) {
      throw new BadRequestException(
        'Удаление запрещено: вы не являетесь владельцем этого списка желаний',
      );
    }

    await this.wishListRepository.delete(wishListId);
    return wishList;
  }

  async update(
    userId: number,
    wishListId: number,
    updateWishListDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOneById(wishListId);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(
        'Редактирование запрещено: вы не являетесь владельцем этого списка желаний',
      );
    }

    const { name, image, itemsId } = updateWishListDto;

    const wishes = await this.wishRepository.find({
      where: { id: In(itemsId) },
    });

    await this.wishListRepository.save({
      ...wishlist,
      name,
      image,
      items: wishes,
    });

    return this.findOneById(wishListId);
  }

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const { name, image, itemsId } = createWishlistDto;
    const owner = await this.userRepository.findOneBy({ id: userId });
    const items = await this.wishRepository.find({
      where: { id: In(itemsId) },
    });
    const wishlist = await this.wishListRepository.save({
      name,
      image,
      owner,
      items,
    });
    return wishlist;
  }
}
