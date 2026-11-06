<<<<<<< HEAD
/*import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
=======
import { Controller, Get } from '@nestjs/common';
>>>>>>> a806b963c46adc6c5b04e601daea42d79e8c549c
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }
}*/


import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }
}
