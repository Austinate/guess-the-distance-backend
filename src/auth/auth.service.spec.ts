import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/common/user.role';

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: DeepMocked<UsersService>;

  beforeEach(async () => {
    userServiceMock = createMock<UsersService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: userServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user if credentials match', async () => {
      const username = 'existing';
      const passwordHash = 'passwordHash';

      const user = new User(username, UserRole.User, passwordHash);
      userServiceMock.findOneByUsername.mockResolvedValueOnce(user);

      expect(await service.validate(username, passwordHash)).toBe(user);
      expect(userServiceMock.findOneByUsername).toBeCalledWith(username);
      expect(userServiceMock.findOneByUsername).toBeCalledTimes(1);
    });

    it('should return null if user credentials do not match', async () => {
      const username = 'existing';

      const user = new User(username, UserRole.User, 'some_hash');
      userServiceMock.findOneByUsername.mockResolvedValueOnce(user);

      expect(await service.validate(username, 'password')).toBeNull();
      expect(userServiceMock.findOneByUsername).toBeCalledWith(username);
      expect(userServiceMock.findOneByUsername).toBeCalledTimes(1);
    });

    it('should return null if user is not found', async () => {
      const username = 'non_existing';

      expect(await service.validate(username, 'password')).toBeNull();
      expect(userServiceMock.findOneByUsername).toBeCalledWith(username);
      expect(userServiceMock.findOneByUsername).toBeCalledTimes(1);
    });
  });
});
