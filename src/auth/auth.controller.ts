
import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Request, Response } from 'express';
import { AuthGuard as MyAuthGuard } from './auth.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() user: UserDto, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.signUp(user);

    this.authService.setAuthCookiesConfigurations(response, access_token);

    return { message: "Signed up sucessfully" }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.authService.setAuthCookiesConfigurations(response);

    return { message: 'Logged out sucessfully' }
  }


  @Get('validate')
  @UseGuards(JwtAuthGuard)
  validateUser() {
    return {isAuthenticated: true}
  }
}
