import { Injectable } from "@nestjs/common";
import { decisionOfEvaluating } from "./utils";
import { EstimateDto } from "./dto/estimate.dto";
import { RatesDto } from "./dto/rates.dto";
import { exchanges } from "./spot.exchanges";

@Injectable()
export class SpotService {
  constructor() {}

  public async estimate(params: EstimateDto) {
    const { inputAmount, inputCurrency, outputCurrency } = params;

    // Calculate the output amount for each exchange
    const outputAmounts = await this.evaluatePairPrice(inputCurrency, outputCurrency, inputAmount)

    if (outputAmounts.every((el) => el.rate === null)) {
      return {
        error: true,
        data: 'This pair of crypto is not available on any exchange',
      };
    }

    // Find the exchange with the highest output amount
    const highestOutputExchange = outputAmounts.reduce(
      (highestExchange, currentExchange) => {
        return currentExchange?.rate > highestExchange?.rate
          ? currentExchange
          : highestExchange;
      },
    );

    return {
      exchangeName: highestOutputExchange.exchangeName,
      outputAmount: highestOutputExchange.rate,
    };
  }

  public async getRates(params: RatesDto) {
    const { baseCurrency, quoteCurrency } = params;

    return this.evaluatePairPrice(baseCurrency, quoteCurrency);
  }

  // Returns an array of exchange objects {exchangeName, rate},
  // with a rate that describes the amount of ${inputCurrency} received by ${inputAmount} of ${outputCurrency}
  private async evaluatePairPrice(inputCurrency: string, outputCurrency: string, inputAmount: number = 1) {
    return await Promise.all(
      exchanges.map(async (exchange) => {
        let estimatePair = exchange.pairs
          .map((pair) => {
            if (
              pair.includes(inputCurrency) &&
              pair.includes(outputCurrency) &&
              pair.length ==
              String(inputCurrency + outputCurrency + exchange.pairSeparator)
                .length
            ) {
              return {
                indexOfInputCurrency: pair.indexOf(inputCurrency),
                pair,
              };
            }
          })
          .find((el) => el != undefined);

        if (!estimatePair) {
          return {
            exchangeName: exchange.name,
            rate: null,
          };
        }

        const pairPrice = await exchange.getPairPrice(estimatePair.pair);

        return {
          exchangeName: exchange.name,
          rate: await decisionOfEvaluating(
            pairPrice,
            inputAmount,
            estimatePair.indexOfInputCurrency,
          ),
        };
      }),
    );
  }
}
