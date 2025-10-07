/**
 * Validation Tests for Portfolio Request
 * Tests the validateRequest function with correct and incorrect requests
 */

import { validateRequest } from '../../src/utils/validation';

describe('Portfolio Request Validation', () => {
  
  test('should accept a valid request with BTC, ETH, and USDT', () => {
    // Example of a CORRECT request
    const validRequest = {
      "portfolio": {
        "BTC": 0.5,
        "ETH": 2.0,
        "USDT": 1000
      },
      "fiat_currency": "CLP"
    };

    // Should not throw an error
    expect(() => validateRequest(validRequest)).not.toThrow();
  });

  test('should reject a request with invalid cryptocurrency NICO', () => {
    // Example of a BAD request - NICO is not in the list
    const invalidRequest = {
      "portfolio": {
        "BTC": 0.5,
        "ETH": 2.0,
        "USDT": 1000,
        "NICO": 12312
      },
      "fiat_currency": "CLP"
    };

    // Should throw an error about invalid cryptocurrency
    expect(() => validateRequest(invalidRequest)).toThrow('Invalid cryptocurrency: NICO');
  });

  test('should accept all valid cryptocurrencies', () => {
    const validRequest = {
      "portfolio": {
        "BTC": 1.0,
        "ETH": 2.0,
        "BCH": 3.0,
        "LTC": 4.0,
        "USDC": 5.0,
        "USDT": 6.0
      },
      "fiat_currency": "CLP"
    };

    expect(() => validateRequest(validRequest)).not.toThrow();
  });

  test('should accept all valid fiat currencies', () => {
    const validCurrencies = ['CLP', 'COP', 'PEN'];

    validCurrencies.forEach(currency => {
      const request = {
        "portfolio": {
          "BTC": 0.5
        },
        "fiat_currency": currency
      };
      expect(() => validateRequest(request)).not.toThrow();
    });
  });

  test('should reject invalid fiat currency', () => {
    const invalidRequest = {
      "portfolio": {
        "BTC": 0.5
      },
      "fiat_currency": "USD"
    };

    expect(() => validateRequest(invalidRequest)).toThrow('Invalid fiat currency: USD');
  });

  test('should reject request with missing portfolio', () => {
    const invalidRequest = {
      "fiat_currency": "CLP"
    };

    expect(() => validateRequest(invalidRequest)).toThrow('Invalid request: missing required fields');
  });

  test('should reject request with missing fiat_currency', () => {
    const invalidRequest = {
      "portfolio": {
        "BTC": 0.5
      }
    };

    expect(() => validateRequest(invalidRequest)).toThrow('Invalid request: missing required fields');
  });

  test('should accept empty portfolio', () => {
    const validRequest = {
      "portfolio": {},
      "fiat_currency": "CLP"
    };

    expect(() => validateRequest(validRequest)).not.toThrow();
  });
});

