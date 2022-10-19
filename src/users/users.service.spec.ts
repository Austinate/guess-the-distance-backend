import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { v4 as uuid } from 'uuid';
import { UserRole } from './user-role.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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

  describe('create', () => {
    const dto = new CreateUserDto();
    dto.username = 'test_user';
    dto.password = 'password';

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = new User(
        dto.username,
        [UserRole.User],
        dto.password,
      );
      repositoryMock.findOne.mockResolvedValueOnce(existingUser);

      expect(service.create(dto)).rejects.toThrowError(ConflictException);
      expect(repositoryMock.findOne).toBeCalledTimes(1);
      expect(repositoryMock.findOne).toBeCalledWith({ username: dto.username });
    });

    it('should create and return new user with valid data', async () => {
      const mockedPasswordHash = await bcrypt.hash(dto.password, 10);

      const createQueryArguments = {
        username: dto.username,
        roles: [UserRole.User],
        passwordHash: mockedPasswordHash,
      };

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce((password) => {
        expect(password).toBe(dto.password);
        return mockedPasswordHash;
      });

      let result: User;
      repositoryMock.create.mockImplementationOnce((fields) => {
        result = new User(
          fields.username,
          [UserRole.User],
          fields.passwordHash,
        );
        expect(fields.passwordHash).not.toEqual(dto.password);
        return result;
      });

      repositoryMock.findOne.mockResolvedValueOnce(null);
      expect(await service.create(dto)).toBe(result);
      expect(repositoryMock.create).toBeCalledWith(createQueryArguments);
      expect(repositoryMock.create).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user if it exists', async () => {
      const result = new User('test_user', [UserRole.User], 'password');
      repositoryMock.findOne.mockResolvedValueOnce(result);
      expect(await service.findOne({ id: result.id })).toBe(result);
      expect(repositoryMock.findOne).toBeCalledTimes(1);
      expect(repositoryMock.findOne).toBeCalledWith({ id: result.id });
    });

    it('should throw NotFoundException if user is missing', async () => {
      const id = uuid();
      repositoryMock.findOne.mockResolvedValueOnce(null);
      expect(service.findOne({ id: id })).rejects.toThrow(NotFoundException);
      expect(repositoryMock.findOne).toBeCalledWith({ id: id });
      expect(repositoryMock.findOne).toBeCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return a user if it exists', async () => {
      const result = new User('test_user', [UserRole.User], 'password');
      repositoryMock.findOne.mockResolvedValueOnce(result);
      expect(await service.findOneById(result.id)).toBe(result);
      expect(repositoryMock.findOne).toBeCalledTimes(1);
      expect(repositoryMock.findOne).toBeCalledWith({ id: result.id });
    });

    it('should throw NotFoundException if user is missing', async () => {
      const id = uuid();
      repositoryMock.findOne.mockResolvedValueOnce(null);
      expect(service.findOneById(id)).rejects.toThrow(NotFoundException);
      expect(repositoryMock.findOne).toBeCalledWith({ id: id });
      expect(repositoryMock.findOne).toBeCalledTimes(1);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user if it exists', async () => {
      const result = new User('test_user', [UserRole.User], 'password');
      repositoryMock.findOne.mockResolvedValueOnce(result);
      expect(await service.findOneByUsername(result.username)).toBe(result);
      expect(repositoryMock.findOne).toBeCalledTimes(1);
      expect(repositoryMock.findOne).toBeCalledWith({
        username: result.username,
      });
    });

    it('should throw NotFoundException if user is missing', async () => {
      const username = 'non-existing';
      repositoryMock.findOne.mockResolvedValueOnce(null);
      expect(service.findOneByUsername(username)).rejects.toThrow(
        NotFoundException,
      );
      expect(repositoryMock.findOne).toBeCalledWith({ username: username });
      expect(repositoryMock.findOne).toBeCalledTimes(1);
    });
  });
});
