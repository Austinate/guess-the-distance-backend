import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/user-role.enum';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: DeepMocked<UsersService>;
  let jwtServiceMock: DeepMocked<JwtService>;

  beforeEach(async () => {
    userServiceMock = createMock<UsersService>();
    jwtServiceMock = createMock<JwtService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
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

      const user = new User(username, [UserRole.User], passwordHash);
      userServiceMock.findOneByUsername.mockResolvedValueOnce(user);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce((bcryptPassword, bcryptPasswordHash) => {
          expect(bcryptPassword).toBe(passwordHash);
          expect(bcryptPasswordHash).toBe(passwordHash);
          return true;
        });

      expect(service.validate(username, passwordHash)).resolves.toBe(user);
      expect(userServiceMock.findOneByUsername).toBeCalledWith(username);
      expect(userServiceMock.findOneByUsername).toBeCalledTimes(1);
    });

    it('should return null if user credentials do not match', async () => {
      const username = 'existing';

      const user = new User(username, [UserRole.User], 'some_hash');
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
