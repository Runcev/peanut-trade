import { Body, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { EstimateDto, RatesDto } from './types';
import { SpotService } from './spot.service';

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get('estimate')
  async estimate(@Body() estimateDto: EstimateDto, @Res() res: Response) {
    const estimated = await this.spotService.estimate(estimateDto);

    return res.json(estimated);
  }

  @Get('rates')
  async getRates(@Body() ratesDto: RatesDto, @Res() res: Response) {
    const rates = await this.spotService.getRates(ratesDto);

    return res.json(rates);
  }
}
