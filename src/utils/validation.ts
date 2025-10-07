/**
 * Validation utilities
 */

import { CryptoCurrency, LocalCurrency } from '../types';

/**
 * Validates the portfolio request body
 * @param requestBody - The request body to validate
 * @throws Error if validation fails
 */
export function validateRequest(requestBody: any): void {
  if (!requestBody || !requestBody.portfolio || !requestBody.fiat_currency) {
    throw new Error('Invalid request: missing required fields');
  }
  
  if (!Object.values(LocalCurrency).includes(requestBody.fiat_currency)) {
    throw new Error(
      `Invalid fiat currency: ${requestBody.fiat_currency}. Valid options are: ${Object.values(LocalCurrency).join(', ')}`
    );
  }

  const validCryptoCurrencies = Object.values(CryptoCurrency);
  const portfolioKeys = Object.keys(requestBody.portfolio);
  
  for (const key of portfolioKeys) {
    if (!validCryptoCurrencies.includes(key as CryptoCurrency)) {
      throw new Error(
        `Invalid cryptocurrency: ${key}. Valid options are: ${validCryptoCurrencies.join(', ')}`
      );
    }
  }
}

