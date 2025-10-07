import {
  IsNotEmpty,
  IsInt,
  IsString,
  Length,
  IsUrl,
  IsEmail,
  IsDate,
} from 'class-validator';

export class SignupUserResponseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(1, 200)
  @IsNotEmpty()
  about: string;

  @IsUrl()
  @IsNotEmpty()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
