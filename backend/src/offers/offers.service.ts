import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from './../wishes/entities/wish.entity';
import { User } from './../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(id: number, createOfferDto: CreateOfferDto) {
    const { itemId, amount } = createOfferDto;

    const wish = await this.wishRepository.findOne({
      relations: { owner: true },
      where: { id: itemId },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id === id) {
      throw new BadRequestException('Нельзя вносить деньги на свои подарки');
    }

    const newRaised = Number(wish.raised) + Number(amount);

    if (newRaised > wish.price) {
      throw new BadRequestException('Слишком большая сумма поддержки');
    }

    await this.wishRepository.update(wish.id, { raised: newRaised });

    const user = await this.userRepository.findOne({
      relations: { wishes: true },
      where: { id },
    });

    const newOffer = await this.offerRepository.save({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    return newOffer;
  }

  async findOneById(offerId: number) {
    const offer = await this.offerRepository.findOne({
      relations: {
        user: true,
        item: true,
      },
      where: {
        id: offerId,
      },
    });
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }

  async findAll() {
    return await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }
}
