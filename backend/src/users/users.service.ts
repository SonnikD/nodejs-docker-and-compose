import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Пользователя с таким id не существует');
    }
    delete user.password;
    return user;
  }

  async findOneByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('Пользователя с таким именем не существует');
    }
    delete user.password;
    return user;
  }

  async findOneByUserNamePass(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('Пользователя с таким именем не существует');
    }
    return user;
  }

  async findWishes(id: number): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователя с таким id не существует');
    }
    return user.wishes;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;
    const exists = await this.userRepository.exists({
      where: [{ username }, { email }],
    });
    if (exists) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    const userWithHash = this.userRepository.create({
      ...createUserDto,
      password: this.hashService.getHash(createUserDto.password),
    });
    const user = await this.userRepository.save(userWithHash);
    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });

    return users;
  }

  async updateOneById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, username, password } = updateUserDto;

    const [existingEmail, existingUsername] = await Promise.all([
      email ? this.userRepository.findOne({ where: { email } }) : null,
      username ? this.userRepository.findOne({ where: { username } }) : null,
    ]);

    if (existingEmail && existingEmail.id !== id) {
      throw new ConflictException('Email уже занят');
    }

    if (existingUsername && existingUsername.id !== id) {
      throw new ConflictException('Username уже занят');
    }

    if (password) {
      updateUserDto.password = this.hashService.getHash(password);
    }

    await this.userRepository.update(id, updateUserDto);

    const updatedUser = await this.userRepository.findOneBy({ id });
    delete updatedUser.password;
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
