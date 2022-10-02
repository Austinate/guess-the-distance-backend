import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './common/user.role';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const { username, password } = dto;

    const existingUser = await this.usersRepository.findOne({
      username: username,
    });
    if (existingUser) {
      throw new ConflictException(
        `User with username ${username} already exists`,
      );
    }

    const createdUser = await this.usersRepository.create({
      username: username,
      role: UserRole.User,
      passwordHash: await bcrypt.hash(password, 10),
    });
    await this.usersRepository.persistAndFlush(createdUser);

    return createdUser;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ id: id });
    if (user) {
      return user;
    } else {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
  }
}
