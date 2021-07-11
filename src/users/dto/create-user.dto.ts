import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty() // for swagger docs
  @IsAlphanumeric()
  @MaxLength(15)
  name: string;

  @ApiProperty({ required: false })
  age?: number;
}
