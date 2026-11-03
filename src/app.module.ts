import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { AulasModule } from './aulas/aulas.module';
import { PeriodosModule } from './periodos/periodos.module';
import { SeccionesModule } from './secciones/secciones.module';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        host: c.get('DB_HOST'),
        port: +c.get('DB_PORT'),
        username: c.get('DB_USER'),
        password: c.get('DB_PASS'),
        database: c.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // el esquema lo manejas tú en pgAdmin
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    AuthModule,
    AsignaturasModule,
    AulasModule,
    PeriodosModule,
    SeccionesModule,
    HorariosModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // 1º autentica
    { provide: APP_GUARD, useClass: RolesGuard },   // 2º autoriza por rol
  ],
})
export class AppModule {}
