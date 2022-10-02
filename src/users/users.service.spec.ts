import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { v4 as uuid } from 'uuid';
import { UserRole } from './common/user.role';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: DeepMocked<EntityRepository<User>>;

  beforeEach(async () => {
    repositoryMock = createMock<EntityRepository<User>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if it exists', async () => {
      const result = new User('test_user', UserRole.User);
      repositoryMock.findOne.mockResolvedValueOnce(result);
      expect(await service.findOne(result.id)).toBe(result);
      expect(repositoryMock.findOne).toBeCalledTimes(1);
      expect(repositoryMock.findOne).toBeCalledWith({ id: result.id });
    });

    it('should throw NotFoundException if user is missing', async () => {
      const id = uuid();
      repositoryMock.findOne.mockResolvedValueOnce(null);
      expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repositoryMock.findOne).toBeCalledWith({ id: id });
      expect(repositoryMock.findOne).toBeCalledTimes(1);
    });
  });
});
