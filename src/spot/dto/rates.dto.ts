import { IsString, IsNotEmpty } from "class-validator";

export class RatesDto {
  @IsString()
  @IsNotEmpty()
  baseCurrency: string;

  @IsString()
  @IsNotEmpty()
  quoteCurrency: string;
}
