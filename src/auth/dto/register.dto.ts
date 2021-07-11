import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @MinLength(5)
  password: string;
}
