import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import makeStatusError from 'src/errors/makeStatusError';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Array<User>> {
    return this.userRepository.find();
  }

  async findById(userId: string): Promise<User> {
    const u = await this.userRepository.findOne({ id: userId });
    if (!u) {
      return null;
    }
    return u;
  }

  async findByName(name: string): Promise<User> {
    const u = await this.userRepository.findOne({ name });
    if (!u) {
      return null;
    }
    return u;
  }

  async createUser(
    name: string,
    provider: string,
    hashedPassword?: string, // a password is not required, because oauth users map to the same user-pg-table
    id?: string,
  ): Promise<User> {
    const hPw = hashedPassword ?? null;
    const uid = id ?? uuidv4();
    console.log(uid, id ?? 'no id');
    const u = new User({
      id: uid,
      hashedPassword: hPw,
      name,
      provider,
    });

    return await this.userRepository.save(u);
  }
}
