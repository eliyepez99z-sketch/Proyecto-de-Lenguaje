import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Ajusta los nombres de los claims a lo que emita tu Proyecto 3
    validate(payload: any) {
    return {
      usuarioExternoId: String(payload.sub ?? payload.id),
      email: payload.email,
      rol: String(payload.rol ?? payload.role ?? '').toLowerCase(),
    };
  }
}
