import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SkipAuth } from './auth/skip-auth.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @SkipAuth()
  @ApiTags('auth')
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
