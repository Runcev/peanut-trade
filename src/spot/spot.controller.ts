import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EstimateDto } from "./dto/estimate.dto";
import { RatesDto } from "./dto/rates.dto";
import { SpotService } from './spot.service';

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get('estimate')
  async estimate(@Query() estimateDto: EstimateDto, @Res() res: Response) {
    const estimated = await this.spotService.estimate(estimateDto);

    return res.json(estimated);
  }

  @Get('rates')
  async getRates(@Query() ratesDto: RatesDto, @Res() res: Response) {
    const rates = await this.spotService.getRates(ratesDto);

    return res.json(rates);
  }
}
