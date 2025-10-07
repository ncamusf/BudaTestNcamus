/**
 * Buda API Service
 * Service for interacting with Buda.com cryptocurrency exchange API
 */

import { TickersResponse } from '../types';

/**
 * Fetches all available tickers from Buda.com API
 * @returns Promise with the tickers data
 * @throws Error if the API request fails
 */
export async function getTickers(): Promise<TickersResponse> {
  const url = 'https://www.buda.com/api/v2/tickers';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as TickersResponse;
    return data;
  } catch (error) {
    console.error('Error fetching tickers from Buda API:', error);
    throw error;
  }
}

