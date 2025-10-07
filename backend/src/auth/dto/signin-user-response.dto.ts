import { IsString, IsNotEmpty, IsJWT } from 'class-validator';

export class SigninUserResponseDto {
  @IsString()
  @IsJWT()
  @IsNotEmpty()
  access_token: string;
}
