import { IsString, IsNotEmpty, IsNumberString } from "class-validator";

export class EstimateDto {
  @IsNumberString()
  @IsNotEmpty()
  inputAmount: number;

  @IsString()
  @IsNotEmpty()
  inputCurrency: string;

  @IsString()
  @IsNotEmpty()
  outputCurrency: string;
}