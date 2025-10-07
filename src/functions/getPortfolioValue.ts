import { onRequest } from 'firebase-functions/v2/https';
import { getTickers } from '../services/buda.service';
import { validateRequest } from '../utils/validation';
import { CryptoCurrency, LocalCurrency, PortfolioRequest, TickersResponse } from '../types';

function getCryptoValue(data: TickersResponse, localCurrency: LocalCurrency, cryptoCurrency: CryptoCurrency) {
  const ticker = data.tickers.find(ticker => ticker.market_id === `${cryptoCurrency}-${localCurrency}`);
  if (!ticker || !ticker.last_price[0]) {
    throw new Error(`Ticker not found for ${cryptoCurrency}-${localCurrency}`);
  }
  return parseFloat(ticker.last_price[0]);
}

function calculatePortfolioValue(requestBody: PortfolioRequest, data: TickersResponse): number {
  let portfolioValue = 0;
  for (const key in requestBody.portfolio) {
    const cryptoValue = getCryptoValue(data, requestBody.fiat_currency, key as CryptoCurrency);
    const portfolioAmount = requestBody.portfolio[key as CryptoCurrency];
    if (cryptoValue && portfolioAmount) {
      portfolioValue += portfolioAmount * cryptoValue;
    } else {
      throw new Error(`Portfolio amount not found for ${key}`);
    }
  }
  return portfolioValue;
}

/**
 * Firebase Cloud Function to get portfolio value
 * Accepts a portfolio of cryptocurrencies and returns their current market values
 */
export const getPortfolioValue = onRequest(
  {
    timeoutSeconds: 120,
    memory: '2GiB'
  },
  async (req, res) => {
    try {
      const requestBody = req.body as PortfolioRequest;
      validateRequest(requestBody);
      
      const data = await getTickers() as TickersResponse;
      const portfolioValue = calculatePortfolioValue(requestBody, data);

      res.status(200).json({ portfolioValue });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to calculate portfolio value',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

