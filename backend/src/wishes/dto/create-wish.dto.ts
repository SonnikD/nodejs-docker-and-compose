import {
  IsNumber,
  IsString,
  Length,
  IsNotEmpty,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsString()
  description: string;
}
