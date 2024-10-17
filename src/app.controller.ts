import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { secretTokenGuard } from './auth/guard.factory';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/hello')
  // @UseGuards(AuthGuard)
  @UseGuards(secretTokenGuard('aladia-100ms-header', 'salakute'))
  getHello(@Body() body: any, @Headers('authorization') auth: string): string {
    console.log('Received a webhook from Aladia');
    console.log(body, 'body');
    console.log(auth, 'auth');
    return this.appService.getHello();
  }
}
