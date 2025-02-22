# Store Sweeper

[![Deploy to Cloud Run](https://github.com/tramlinehq/store-sweeper/actions/workflows/deploy.yml/badge.svg)](https://github.com/tramlinehq/store-sweeper/actions/workflows/deploy.yml)

[![Tests](https://github.com/tramlinehq/store-sweeper/actions/workflows/test.yml/badge.svg)](https://github.com/tramlinehq/store-sweeper/actions/workflows/test.yml)

A Node.js service that provides a unified API for searching both Apple App Store and Google Play Store.

## Features

- Unified search (via `/search` endpoint) across both app stores
- Configurable search query parameters (`searchTerm`, `numCount`, `lang`, and `country`)
- JWT authentication for API security
- Health check endpoint

| Endpoint | Method | Query Parameters | Default Values | Description |
|----------|---------|-----------------|----------------|-------------|
| `/search` | GET | `searchTerm` (required)<br>`numCount`<br>`lang`<br>`country` | `numCount`: 50 (range: 1 - 250) <br>`lang`: "en"<br>`country`: "us" | Searches both app stores and returns sorted results by rating |
| `/healthz` | GET | None | None | Health check endpoint that returns OK status |

Additional notes for `/search`:
- Responds with both App Store and Play Store results combined
- Results are sorted by rating in descending order
- For country codes, both stores support the ISO 3166-1 alpha-2 format (e.g., US, GB, IN)
- Response includes metadata about the search query and result count

> Quick Note:
There's also `\tsearch` endpoint that is available at the moment that is meant for testing
but please do not use it in production, in a subsequent version of the store-sweeper, this
endpoint will be removed.

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
  "results": [{
    "id": "number",
    "name": "string",
    "bundleId": "string",
    "developerName": "string",
    "version": "string",
    "averageRating": "number",
    "iconUrl": "string",
    "description": "string",
    "country": "string",
    "appUrl": "string",
    "store": "app-store" | "play-store",
  },...],
  "metadata": {
    "query": {
      "app_store": { ... },
      "play_store": { ... }
    },
    "count": "number"
  }
}
```

## License

This project is licensed under the [MIT License](LICENSE.md)
