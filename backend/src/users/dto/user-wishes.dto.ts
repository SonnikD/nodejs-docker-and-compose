import {
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';

export class UserWishesDto {
  @IsInt()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  raised: number;

  @IsInt()
  copied: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsArray()
  offers: Offer[];
}
