
export enum CryptoCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  BCH = 'BCH',
  LTC = 'LTC',
  USDC = 'USDC',
  USDT = 'USDT'
}

export enum LocalCurrency {
  CLP = 'CLP',
  COP = 'COP',
  PEN = 'PEN'
}

export interface PortfolioRequest {
  portfolio: {
    [key in CryptoCurrency]?: number;
  };
  fiat_currency: LocalCurrency;
}

export interface Ticker {
  market_id: string;
  price_variation_24h: string;
  price_variation_7d: string;
  last_price: [string, string];
}

export interface TickersResponse {
  tickers: Ticker[];
}

