import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    return this.usersService.findByEmail(email);
  }

  async login(user: GoogleUser) {
    const dbUser = await this.usersService.findOrCreateFromGoogle({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      googleId: user.googleId,
    });

    const payload = {
      email: dbUser.email,
      sub: dbUser.id,
      name: `${dbUser.firstName} ${dbUser.lastName}`,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        picture: dbUser.picture,
      },
    };
  }

  async googleLogin(req: {
    user?: GoogleUser;
  }): Promise<{ message: string; user?: GoogleUser }> {
    if (!req.user) {
      return { message: 'No user from google' };
    }
    return {
      message: 'User info from google',
      user: req.user,
    };
  }
}
