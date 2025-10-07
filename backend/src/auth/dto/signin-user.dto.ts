import { IsString, Length, IsNotEmpty, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  password: string;
}
