
import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request, @Res() res: Response) {
    this.authService.setAuthCookiesConfigurations(res, req.user as string);

    return res.send({
      message: 'Login successful',
      auth_token: req.user
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() user: UserDto, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.signUp(user);

    this.authService.setAuthCookiesConfigurations(response, access_token);

    return { message: "Signed up sucessfully", access_token }
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
