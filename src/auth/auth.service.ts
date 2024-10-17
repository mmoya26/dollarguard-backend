import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';
import { Response } from 'express';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userService: UsersService
  ) { }

  async validateUser({ username, password }: UserLoginDto) {
    const user = await this.usersService.findUserByEmail(username);

    // if (!user) throw new UnauthorizedException();
    if (!user) return null;

    const isPasswordAMatch = await bcrypt.compare(password, user.password);

    // Might need to change this?
    if (!isPasswordAMatch) throw new UnauthorizedException();

    const payload: UserJWTPayload = { id: user.id, email: user.email, name: user.name };

    return await this.jwtService.signAsync(payload);
  }

  async signUp(user: UserDto) {
    const { id, email, name } = await this.userService.createUser(user);

    const payload: UserJWTPayload = { id, email, name };

    return {
      userId: id,
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  setAuthCookiesConfigurations(res: Response, access_token?: string) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('auth_token', access_token ? access_token : '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'none',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days in milliseconds
    });
  }
}