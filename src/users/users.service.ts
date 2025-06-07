import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createFromGoogle(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      picture: googleUser.picture,
      googleId: googleUser.googleId,
    });
    return this.usersRepository.save(user);
  }

  async findOrCreateFromGoogle(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
  }): Promise<User> {
    let user = await this.findByEmail(googleUser.email);

    if (!user) {
      user = await this.createFromGoogle(googleUser);
    }

    return user;
  }
}
