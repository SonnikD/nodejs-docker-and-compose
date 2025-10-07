import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    return wish;
  }

  async create(id: number, createWishDto: CreateWishDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restUser } = user;
    return await this.wishRepository.save({
      ...createWishDto,
      owner: restUser,
    });
  }

  async findLast() {
    const wishes = await this.wishRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
      take: 40,
    });

    return wishes;
  }

  async findTop() {
    const wishes = await this.wishRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });

    return wishes;
  }

  async update(userId: number, wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOneById(wishId);

    if (updateWishDto.price && wish.raised > 0) {
      throw new BadRequestException(
        'Нельзя изменить цену, так как уже есть взносы от других пользователей',
      );
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(
        'Редактирование запрещено: вы не являетесь владельцем этого подарка',
      );
    }

    await this.wishRepository.update(wishId, updateWishDto);
    return this.findOneById(wishId);
  }

  async copy(userId: number, wishId: number) {
    const wish = await this.findOneById(wishId);

    if (wish.owner.id === userId) {
      throw new BadRequestException('Нельзя скопировать собственный подарок');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wishes'],
    });

    const alreadyHasWish = user.wishes.some((w) => w.id === wish.id);
    if (alreadyHasWish) {
      throw new ConflictException('У вас уже есть такой подарок');
    }

    const copy = this.wishRepository.create({
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
    });

    wish.copied++;
    await this.wishRepository.save(wish);
    await this.wishRepository.save(copy);

    return {};
  }

  async remove(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findOneById(wishId);

    if (userId !== wish.owner.id) {
      throw new BadRequestException(
        'Удаление запрещено: вы не являетесь владельцем этого подарка',
      );
    }

    await this.wishRepository.delete(wishId);
    return wish;
  }
}
