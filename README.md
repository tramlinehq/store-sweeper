# Store Sweeper

A Node.js service that provides a unified API for searching both Apple App Store and Google Play Store.

## Features

- Unified search (via `/search` endpoint) across both app stores
- Configurable search query parameters (`searchTerm`, `numCount`, `lang`, and `country`)
- JWT authentication for API security
- Health check endpoint

## Prerequisites

- Node.js (>= 18)
- npm
- Docker (for containerization)
- Google Cloud CLI (for deployment)

## Development

1. Clone the repository:
```bash
git clone https://github.com/your-org/store-sweeper.git
```
2. Install dependencies
```bash
npm install
```
3. Create a `.env` file
```bash
PORT=8081
ENV=development
AUTH_SECRET=your-secret-key
AUTH_ISSUER=your-issuer
AUTH_AUDIENCE=your-audience
PLAY_STORE_API_URL=http://play-store-api:3000
```

4. Run using `npm run dev`

NOTE: any changes will also reload your API since we have `nodemon` watching over the files.

## Response Structure

```json
{
  "results": {
    "app_store": [...],
    "play_store": [...]
  }
}
```

## License

This project is licensed under the [MIT License](LICENSE.md)
