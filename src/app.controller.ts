import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/hello')
  getHello(@Body() body: any, @Headers('authorization') auth: string): string {
    console.log('Recieved a webhook from Aladia');
    console.log(body, 'body');
    console.log(auth, 'auth');
    return this.appService.getHello();
  }
}
