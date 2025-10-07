import { onRequest } from 'firebase-functions/v2/https';
import { getMarkets } from '../services/buda.service';
import { validateRequest } from '../utils/validation';
import { PortfolioRequest, MarketsResponse } from '../types';

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
      
      // Get markets from Buda
      const data = await getMarkets() as MarketsResponse;
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch markets',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

