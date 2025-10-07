# Buda Portfolio API

Firebase Cloud Functions API to get the value of a cryptocurrency portfolio using the Buda.com API.

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
│   └── validation.test.ts        # Validation tests
├── index.ts                      # Main entry point
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
└── firebase.json                 # Firebase configuration

```

## 🚀 Installation

```bash
npm install
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch
```

## 🔧 Development

```bash
# Compile TypeScript
npm run build

# Run locally
npm start
```

## 📝 API

### `getPortfolioValue`

Cloud Function that accepts a cryptocurrency portfolio and returns current market values.

**Request Body:**
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

**Supported cryptocurrencies:**
- BTC (Bitcoin)
- ETH (Ethereum)
- BCH (Bitcoin Cash)
- LTC (Litecoin)
- USDC (USD Coin)
- USDT (Tether)

**Supported fiat currencies:**
- CLP (Chilean Peso)
- COP (Colombian Peso)
- PEN (Peruvian Sol)

## 🏗️ Architecture

The project follows a modular architecture with separation of concerns:

- **Functions**: Contains Firebase Cloud Functions
- **Services**: External API integration logic
- **Types**: Shared type definitions
- **Utils**: Helper functions and validations
- **Test**: Unit test suite

## 📦 Technologies

- TypeScript
- Firebase Cloud Functions
- Jest (Testing)
- Node.js >= 18.0.0
