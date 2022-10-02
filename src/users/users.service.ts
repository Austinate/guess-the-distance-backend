import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ id: id });
    if (user) {
      return user;
    } else {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
  }
}
