import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'uid of the user' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ example: 'max', description: 'name of the user' })
  @Column()
  name: string;

  // no swagger decorator -> not visible in the docs.
  @Column({ nullable: true })
  @Exclude()
  hashedPassword?: string;

  @Column()
  provider: string; // auth strategy: local, twitch, google etc.

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
