import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { v4 as uuid } from 'uuid';

describe('AppController', () => {
  let appController: AppController;
  let authServiceMock: DeepMocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = createMock<AuthService>();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('auth', () => {
    it('login request should return JWT if credentials are correct', async () => {
      const request = {
        user: { username: 'austinate', userId: uuid() },
      };

      const expectedToken = 'token';
      authServiceMock.login.mockImplementationOnce((user) => {
        expect(user.username).toBe(request.user.username);
        expect(user.userId).toBe(request.user.userId);

        return Promise.resolve({ accessToken: expectedToken });
      });

      expect(await appController.login(request)).toMatchObject({
        accessToken: expectedToken,
      });
      expect(authServiceMock.login).toBeCalledTimes(1);
      expect(authServiceMock.login).toBeCalledWith({ ...request.user });
    });
  });
});
