import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth() {
    // This route initiates the Google OAuth flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth redirect' })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.googleLogin(req);
    if (result.user) {
      const loginResult = await this.authService.login(result.user);
      // You can customize this to redirect to your frontend with the token
      return res.redirect(`/auth/success?token=${loginResult.access_token}`);
    }
    return res.redirect('/auth/failure');
  }

  @Get('success')
  @ApiOperation({ summary: 'OAuth success page' })
  async success() {
    return { message: 'Authentication successful' };
  }

  @Get('failure')
  @ApiOperation({ summary: 'OAuth failure page' })
  async failure() {
    return { message: 'Authentication failed' };
  }
}
