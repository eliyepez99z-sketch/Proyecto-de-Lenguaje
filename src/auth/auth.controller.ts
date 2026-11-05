import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtService } from '@nestjs/jwt'; // Asegúrate de tenerlo o inyectarlo si usas NestJS JWT

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // Si usas JwtService para firmar el token directamente aquí para pruebas:
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  login(@Body() body: { email: string; rol: string }) {
    // Generamos un token de prueba con el payload que espera tu JwtStrategy
    const payload = { sub: 1, email: body.email, rol: body.rol || 'ADMIN' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }
}