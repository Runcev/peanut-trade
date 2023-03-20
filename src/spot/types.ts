import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class EstimateDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  inputAmount: number;

  @IsString()
  @IsNotEmpty()
  inputCurrency: string;

  @IsString()
  @IsNotEmpty()
  outputCurrency: string;
}

export class RatesDto {
  @IsString()
  @IsNotEmpty()
  baseCurrency: string;

  @IsString()
  @IsNotEmpty()
  quoteCurrency: string;
}
