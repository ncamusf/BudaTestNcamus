# 🏦 Buda Portfolio API

A serverless Firebase Cloud Functions API that calculates the current value of your cryptocurrency portfolio using real-time market data from the Buda.com API.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)]()
[![Firebase](https://img.shields.io/badge/Firebase-Functions%20v2-orange)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Contributing](#-contributing)

## ✨ Features

- 🔥 **Serverless Architecture** - Built on Firebase Cloud Functions v2
- 💰 **Real-time Pricing** - Fetches live cryptocurrency prices from Buda.com
- 🌎 **Multi-currency Support** - Supports CLP, COP, and PEN fiat currencies
- 🪙 **Multiple Cryptocurrencies** - Supports BTC, ETH, BCH, LTC, USDC, and USDT
- ✅ **Input Validation** - Robust request validation
- 🧪 **Well-tested** - Comprehensive test coverage with Jest
- 📝 **TypeScript** - Fully typed for better developer experience
- ⚡ **Optimized** - 2GiB memory allocation and 120s timeout for reliable performance

## 📁 Project Structure

```
testBuda/
├── src/                          # Source code
│   ├── functions/                # Firebase Cloud Functions
│   │   └── getPortfolioValue.ts  # Main portfolio function
│   ├── services/                 # External services
│   │   └── buda.service.ts       # Buda API service
│   ├── types/                    # TypeScript types and interfaces
│   │   └── index.ts              # Type definitions
│   └── utils/                    # Utilities
│       └── validation.ts         # Request validation
├── test/                         # Tests
│   ├── functions/                # Function tests
│   │   └── getPortfolioValue.test.ts
│   └── utils/                    # Utility tests
│       └── validation.test.ts
├── dist/                         # Compiled JavaScript
├── index.ts                      # Main entry point
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
└── firebase.json                 # Firebase configuration
```

## 🔑 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** (comes with Node.js)
- **Firebase CLI** (for deployment)
  ```bash
  npm install -g firebase-tools
  ```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd testBuda
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Login to Firebase (if deploying):**
   ```bash
   firebase login
   ```

## 🔧 Development

```bash
# Compile TypeScript
npm run build

# Run locally
npm start

# Watch mode (auto-compile on changes)
tsc --watch
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 API Documentation

### Endpoint: `getPortfolioValue`

A Firebase Cloud Function that accepts a cryptocurrency portfolio and returns its current market value in the specified fiat currency.

#### **HTTP Method:** `POST`

#### **Request Headers:**
```
Content-Type: application/json
```

#### **Request Body:**

```json
{
  "portfolio": {
    "BTC": 0.5,
    "ETH": 2.0,
    "USDT": 1000
  },
  "fiat_currency": "CLP"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `portfolio` | object | Yes | Object containing cryptocurrency amounts |
| `fiat_currency` | string | Yes | Target fiat currency (CLP, COP, or PEN) |

#### **Supported Cryptocurrencies:**

| Symbol | Name | Description |
|--------|------|-------------|
| `BTC` | Bitcoin | The original cryptocurrency |
| `ETH` | Ethereum | Smart contract platform |
| `BCH` | Bitcoin Cash | Bitcoin fork focused on payments |
| `LTC` | Litecoin | Peer-to-peer cryptocurrency |
| `USDC` | USD Coin | USD-backed stablecoin |
| `USDT` | Tether | USD-pegged stablecoin |

#### **Supported Fiat Currencies:**

| Code | Currency | Country |
|------|----------|---------|
| `CLP` | Chilean Peso | Chile |
| `COP` | Colombian Peso | Colombia |
| `PEN` | Peruvian Sol | Peru |

#### **Success Response:**

**Status Code:** `200 OK`

```json
{
  "portfolioValue": 45678900.50
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `portfolioValue` | number | Total portfolio value in the requested fiat currency |

#### **Example Responses:**

**Example 1: Bitcoin and Ethereum portfolio in CLP**

Request:
```json
{
  "portfolio": {
    "BTC": 0.5,
    "ETH": 2.0
  },
  "fiat_currency": "CLP"
}
```

Response:
```json
{
  "portfolioValue": 45678900.50
}
```

**Example 2: Mixed portfolio in COP**

Request:
```json
{
  "portfolio": {
    "BTC": 0.1,
    "ETH": 1.5,
    "USDT": 5000,
    "USDC": 2000
  },
  "fiat_currency": "COP"
}
```

Response:
```json
{
  "portfolioValue": 125678450.75
}
```

**Example 3: Stablecoin portfolio in PEN**

Request:
```json
{
  "portfolio": {
    "USDT": 10000,
    "USDC": 5000
  },
  "fiat_currency": "PEN"
}
```

Response:
```json
{
  "portfolioValue": 56250.00
}
```

#### **Error Responses:**

**Status Code:** `500 Internal Server Error`

**Error Response Format:**
```json
{
  "error": "Failed to calculate portfolio value",
  "message": "<specific error message>"
}
```

**Common Error Scenarios:**

1. **Invalid Cryptocurrency:**
   ```json
   {
     "error": "Failed to calculate portfolio value",
     "message": "Invalid cryptocurrency: XYZ. Supported: BTC, ETH, BCH, LTC, USDC, USDT"
   }
   ```

2. **Invalid Fiat Currency:**
   ```json
   {
     "error": "Failed to calculate portfolio value",
     "message": "Invalid fiat currency: USD. Supported: CLP, COP, PEN"
   }
   ```

3. **Missing Required Fields:**
   ```json
   {
     "error": "Failed to calculate portfolio value",
     "message": "Portfolio is required"
   }
   ```

4. **Invalid Portfolio Format:**
   ```json
   {
     "error": "Failed to calculate portfolio value",
     "message": "Portfolio must be an object"
   }
   ```

5. **Ticker Not Found:**
   ```json
   {
     "error": "Failed to calculate portfolio value",
     "message": "Ticker not found for BTC-CLP"
   }
   ```

#### **cURL Example:**

```bash
curl -X POST https://your-region-your-project.cloudfunctions.net/getPortfolioValue \
  -H "Content-Type: application/json" \
  -d '{
    "portfolio": {
      "BTC": 0.5,
      "ETH": 2.0,
      "USDT": 1000
    },
    "fiat_currency": "CLP"
  }'
```

#### **JavaScript/TypeScript Example:**

```typescript
const response = await fetch('https://your-region-your-project.cloudfunctions.net/getPortfolioValue', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    portfolio: {
      BTC: 0.5,
      ETH: 2.0,
      USDT: 1000
    },
    fiat_currency: 'CLP'
  })
});

const data = await response.json();
console.log('Portfolio Value:', data.portfolioValue);
```

#### **Python Example:**

```python
import requests
import json

url = 'https://your-region-your-project.cloudfunctions.net/getPortfolioValue'
payload = {
    "portfolio": {
        "BTC": 0.5,
        "ETH": 2.0,
        "USDT": 1000
    },
    "fiat_currency": "CLP"
}

response = requests.post(url, json=payload)
data = response.json()
print(f"Portfolio Value: {data['portfolioValue']}")
```

## 🚀 Deployment

### Deploy to Firebase

1. **Initialize Firebase (first time only):**
   ```bash
   firebase init functions
   ```

2. **Deploy the function:**
   ```bash
   firebase deploy --only functions
   ```

3. **Deploy specific function:**
   ```bash
   firebase deploy --only functions:getPortfolioValue
   ```

4. **View function URL:**
   After deployment, Firebase will provide the function URL:
   ```
   https://<region>-<project-id>.cloudfunctions.net/getPortfolioValue
   ```

### Environment Configuration

The function is configured with:
- **Memory:** 2GiB
- **Timeout:** 120 seconds
- **Runtime:** Node.js 18+

You can modify these in `src/functions/getPortfolioValue.ts`:
```typescript
export const getPortfolioValue = onRequest(
  {
    timeoutSeconds: 120,
    memory: '2GiB'
  },
  async (req, res) => {
    // ...
  }
);
```

## 🏗️ Architecture

The project follows a clean, modular architecture with separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Firebase Cloud Function             │
│         (getPortfolioValue)                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │   Validation   │
         │     Layer      │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  Buda Service  │ ◄──── External API
         └────────┬───────┘       (Buda.com)
                  │
                  ▼
         ┌────────────────┐
         │  Calculation   │
         │     Logic      │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │    Response    │
         └────────────────┘
```

### Layer Responsibilities:

- **Functions Layer** (`src/functions/`): Entry point for Cloud Functions, request handling, and response formatting
- **Validation Layer** (`src/utils/`): Input validation and error checking
- **Services Layer** (`src/services/`): External API integration (Buda.com)
- **Types Layer** (`src/types/`): Shared TypeScript interfaces and enums
- **Business Logic**: Portfolio value calculation and data transformation

## 📦 Technologies

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **Firebase Cloud Functions v2** | Serverless compute platform |
| **Jest** | Testing framework |
| **ts-jest** | TypeScript support for Jest |
| **Node.js >= 18.0.0** | JavaScript runtime |
| **Buda.com API** | Cryptocurrency market data |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines:

- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Made with ❤️ using TypeScript and Firebase**
