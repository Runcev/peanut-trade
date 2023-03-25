import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

const httpService = new HttpService();

// Define the exchange objects
export const exchanges = [
  {
    name: 'Binance',
    pairSeparator: '',
    //Can be an array of symbols fetched via API
    pairs: ['BTCUSDT', 'ETHUSDT', 'ETHBTC', 'ADABTC'],
    getPairPrice: async (binanceSymbol: string) => {
      const binancePrice = await firstValueFrom(
        httpService.get(
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
        httpService.get(
          `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${kucoinSymbol}`,
        ),
      );
      return parseFloat(kucoinPrice.data.data.price);
    },
  },
];
