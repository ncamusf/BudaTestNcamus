/**
 * Tests for Portfolio Value Functions
 * Tests the getCryptoValue, calculatePortfolioValue, and getPortfolioValue functions
 */

import { LocalCurrency, PortfolioRequest, TickersResponse } from '../../src/types';

// Mock the firebase-functions module
jest.mock('firebase-functions/v2/https', () => ({
  onRequest: jest.fn((options, handler) => handler)
}));

// Mock the buda.service module
jest.mock('../../src/services/buda.service', () => ({
  getTickers: jest.fn()
}));

// Mock the validation module
jest.mock('../../src/utils/validation', () => ({
  validateRequest: jest.fn()
}));

import { getTickers } from '../../src/services/buda.service';
import { validateRequest } from '../../src/utils/validation';

// Import the function after mocks are set up
import { getPortfolioValue } from '../../src/functions/getPortfolioValue';

// Create mock request and response objects
const createMockRequest = (body: any) => ({
  body,
  method: 'POST',
  headers: {},
  query: {}
});

const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock ticker data for testing
const mockTickersData: TickersResponse = {
  tickers: [
    {
      market_id: 'BTC-CLP',
      price_variation_24h: '2.5',
      price_variation_7d: '5.0',
      last_price: ['50000000', 'CLP']
    },
    {
      market_id: 'ETH-CLP',
      price_variation_24h: '1.5',
      price_variation_7d: '3.0',
      last_price: ['3000000', 'CLP']
    },
    {
      market_id: 'USDT-CLP',
      price_variation_24h: '0.1',
      price_variation_7d: '0.2',
      last_price: ['900', 'CLP']
    },
    {
      market_id: 'BTC-COP',
      price_variation_24h: '2.5',
      price_variation_7d: '5.0',
      last_price: ['200000000', 'COP']
    },
    {
      market_id: 'ETH-PEN',
      price_variation_24h: '1.5',
      price_variation_7d: '3.0',
      last_price: ['15000', 'PEN']
    }
  ]
};

describe('Portfolio Value Calculation', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    (getTickers as jest.Mock).mockResolvedValue(mockTickersData);
    (validateRequest as jest.Mock).mockImplementation(() => {});
  });

  describe('getPortfolioValue Cloud Function', () => {
    
    test('should calculate portfolio value correctly for single cryptocurrency', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 1.0
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(validateRequest).toHaveBeenCalledWith(requestBody);
      expect(getTickers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 50000000
      });
    });

    test('should calculate portfolio value correctly for multiple cryptocurrencies', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 0.5,
          ETH: 2.0,
          USDT: 1000
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 25000000 + 6000000 + 900000
      });
    });

    test('should handle different fiat currencies', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 1.0
        },
        fiat_currency: LocalCurrency.COP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 200000000
      });
    });

    test('should return error when ticker is not found', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BCH: 1.0
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to calculate portfolio value',
        message: 'Ticker not found for BCH-CLP'
      });
    });

    test('should handle validation errors', async () => {
      (validateRequest as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid fiat currency: USD');
      });

      const requestBody = {
        portfolio: {
          BTC: 0.5
        },
        fiat_currency: 'USD'
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to calculate portfolio value',
        message: 'Invalid fiat currency: USD'
      });
    });

    test('should handle API errors from getTickers', async () => {
      (getTickers as jest.Mock).mockRejectedValue(new Error('API unavailable'));

      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 1.0
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to calculate portfolio value',
        message: 'API unavailable'
      });
    });

    test('should handle empty portfolio', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {},
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 0
      });
    });

    test('should handle decimal amounts correctly', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 0.001,
          ETH: 1.5
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 50000 + 4500000
      });
    });

    test('should handle ticker with missing price data', async () => {
      const invalidTickersData: TickersResponse = {
        tickers: [
          {
            market_id: 'BTC-CLP',
            price_variation_24h: '2.5',
            price_variation_7d: '5.0',
            last_price: [] as any 
          }
        ]
      };

      (getTickers as jest.Mock).mockResolvedValue(invalidTickersData);

      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 1.0
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to calculate portfolio value',
        message: 'Ticker not found for BTC-CLP'
      });
    });

    test('should handle large portfolio values', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 100,
          ETH: 500
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 5000000000 + 1500000000
      });
    });

    test('should handle unknown errors gracefully', async () => {
      (getTickers as jest.Mock).mockRejectedValue('String error, not Error object');

      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 1.0
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to calculate portfolio value',
        message: 'Unknown error'
      });
    });
  });

  describe('Edge Cases', () => {
    
    test('should throw error for zero amount cryptocurrency', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 0
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to calculate portfolio value',
        message: 'Portfolio amount not found for BTC'
      });
    });

    test('should handle very small amounts with precision', async () => {
      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 0.00000001
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 0.5
      });
    });

    test('should handle all supported cryptocurrencies', async () => {
      const fullTickersData: TickersResponse = {
        tickers: [
          { market_id: 'BTC-CLP', price_variation_24h: '2.5', price_variation_7d: '5.0', last_price: ['50000000', 'CLP'] },
          { market_id: 'ETH-CLP', price_variation_24h: '1.5', price_variation_7d: '3.0', last_price: ['3000000', 'CLP'] },
          { market_id: 'BCH-CLP', price_variation_24h: '0.5', price_variation_7d: '1.0', last_price: ['200000', 'CLP'] },
          { market_id: 'LTC-CLP', price_variation_24h: '0.8', price_variation_7d: '1.5', last_price: ['80000', 'CLP'] },
          { market_id: 'USDC-CLP', price_variation_24h: '0.1', price_variation_7d: '0.2', last_price: ['900', 'CLP'] },
          { market_id: 'USDT-CLP', price_variation_24h: '0.1', price_variation_7d: '0.2', last_price: ['900', 'CLP'] }
        ]
      };

      (getTickers as jest.Mock).mockResolvedValue(fullTickersData);

      const requestBody: PortfolioRequest = {
        portfolio: {
          BTC: 1,
          ETH: 1,
          BCH: 1,
          LTC: 1,
          USDC: 1,
          USDT: 1
        },
        fiat_currency: LocalCurrency.CLP
      };

      const req = createMockRequest(requestBody);
      const res = createMockResponse();

      await getPortfolioValue(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        portfolioValue: 50000000 + 3000000 + 200000 + 80000 + 900 + 900
      });
    });
  });
});

