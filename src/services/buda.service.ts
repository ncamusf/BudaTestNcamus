/**
 * Buda API Service
 * Service for interacting with Buda.com cryptocurrency exchange API
 */

import { MarketsResponse } from '../types';

/**
 * Fetches all available markets from Buda.com API
 * @returns Promise with the markets data
 * @throws Error if the API request fails
 */
export async function getMarkets(): Promise<MarketsResponse> {
  const url = 'https://www.buda.com/api/v2/markets';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as MarketsResponse;
    return data;
  } catch (error) {
    console.error('Error fetching markets from Buda API:', error);
    throw error;
  }
}

