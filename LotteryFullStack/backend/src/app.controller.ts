import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check-status')
  async checkStatus() {
    return {result: await this.appService.checkStatus()}
  }

  @Post('open-lottery')
  async openLottery(@Body('time') time: number) {
    return {result: await this.appService.openLottery(time)}
  }

  @Post('close-lottery')
  async closeLottery() {
    return {result: await this.appService.closeLottery()}
  }
}
