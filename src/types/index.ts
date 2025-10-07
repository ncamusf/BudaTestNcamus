
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

export interface Market {
  base_currency: string;
  quote_currency: string;
  id: string;
  name: string;
  minimum_order_amount: [string, string];
  disabled: boolean;
  illiquid: boolean;
  rpo_disabled: boolean | null;
  taker_fee: number;
  maker_fee: number;
  max_orders_per_minute: number;
  maker_discount_percentage: string;
  taker_discount_percentage: string;
  taker_discount_tiers: Record<string, string>;
  maker_discount_tiers: Record<string, string>;
}

export interface MarketsResponse {
  markets: Market[];
}

