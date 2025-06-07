import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google login page',
  })
  async googleAuth() {
    // This route initiates the Google OAuth flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth redirect' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT token and user info',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            picture: {
              type: 'string',
              example: 'https://example.com/photo.jpg',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
  })
  async googleAuthRedirect(@Req() req) {
    const result = await this.authService.googleLogin(req);
    if (result.user) {
      return this.authService.login(result.user);
    }
    return { message: 'Authentication failed' };
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
