import { IsNumber, Min, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  @IsNotEmpty()
  itemId: number;
}
