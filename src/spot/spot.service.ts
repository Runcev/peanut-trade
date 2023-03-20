import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EstimateDto, RatesDto } from './types';

@Injectable()
export class SpotService {
  constructor(private readonly httpService: HttpService) {}

  // Define the exchange objects
  public exchanges = [
    {
      name: 'Binance',
      pairSeparator: '',
      //Can be an array of symbols fetched via API
      pairs: ['BTCUSDT', 'ETHUSDT', 'ETHBTC', 'ADABTC'],
      getPairPrice: async (binanceSymbol: string) => {
        const binancePrice = await firstValueFrom(
          this.httpService.get(
            `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`,
          ),
        );
        return parseFloat(binancePrice.data.price);
      },
    },
    {
      name: 'KuCoin',
      pairSeparator: '-',
      //Can be an array of symbols fetched via API
      pairs: ['BTC-USDT', 'ETH-USDT', 'ETH-BTC', 'ADA-BTC'],
      getPairPrice: async (kucoinSymbol: string) => {
        const kucoinPrice = await firstValueFrom(
          this.httpService.get(
            `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${kucoinSymbol}`,
          ),
        );
        return parseFloat(kucoinPrice.data.data.price);
      },
    },
  ];

  public async estimate(params: EstimateDto) {
    const { inputAmount, inputCurrency, outputCurrency } = params;

    // Calculate the output amount for each exchange
    const outputAmounts = await Promise.all(
      this.exchanges.map(async (exchange) => {
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
            name: exchange.name,
            outputAmount: null,
          };
        }

        const pairPrice = await exchange.getPairPrice(estimatePair.pair);

        return {
          name: exchange.name,
          outputAmount: await this.decisionOfEvaluating(
            pairPrice,
            inputAmount,
            estimatePair.indexOfInputCurrency,
          ),
        };
      }),
    );

    if (outputAmounts.every((el) => el.outputAmount === null)) {
      return {
        error: true,
        data: 'This pair of crypto is not available on any exchange',
      };
    }

    // Find the exchange with the highest output amount
    const highestOutputExchange = outputAmounts.reduce(
      (highestExchange, currentExchange) => {
        return currentExchange?.outputAmount > highestExchange?.outputAmount
          ? currentExchange
          : highestExchange;
      },
    );

    return {
      exchangeName: highestOutputExchange.name,
      outputAmount: highestOutputExchange?.outputAmount,
    };
  }

  public async getRates(params: RatesDto) {
    const { baseCurrency, quoteCurrency } = params;

    const rates = await Promise.all(
      this.exchanges.map(async (exchange) => {
        let estimatePair = exchange.pairs
          .map((pair) => {
            if (
              pair.includes(baseCurrency) &&
              pair.includes(quoteCurrency) &&
              pair.length ==
                String(baseCurrency + quoteCurrency + exchange.pairSeparator)
                  .length
            ) {
              return {
                indexOfBaseCurrency: pair.indexOf(baseCurrency),
                pair,
              };
            }
          })
          .find((el) => el != undefined);

        if (!estimatePair) {
          return {
            exchangeName: exchange.name,
            rate: 'This pair of crypto is not available',
          };
        }

        const pairPrice = await exchange.getPairPrice(estimatePair.pair);

        return {
          exchangeName: exchange.name,
          rate: await this.getRateDependsOfIndex(
            pairPrice,
            estimatePair.indexOfBaseCurrency,
          ),
        };
      }),
    );

    return rates;
  }

  // Decision regarding the way of calculating
  private async decisionOfEvaluating(
    price: number,
    inputAmount: number,
    indexOfInputCurrency: number,
  ): Promise<number> {
    return indexOfInputCurrency === 0
      ? inputAmount * price
      : inputAmount / price;
  }

  private async getRateDependsOfIndex(
    price: number,
    indexOfBaseCurrency: number,
  ): Promise<number> {
    return indexOfBaseCurrency === 0 ? price : 1 / price;
  }
}
