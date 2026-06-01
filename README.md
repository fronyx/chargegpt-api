# ChargeGPT API

ChargeGPT API is the core backend for ChargeGPT. It exposes the API used by the web client and coordinates prediction, location, and conversation services.

## Setup

1. Install dependencies with `npm ci`.
2. Create a local `.env` file.
3. Configure the services you want to use, such as PostgreSQL, queues, S3-compatible storage, and Sentry.

## Environment

The backend is configured through environment variables. Keep credentials, service URLs, and deployment-specific values outside the repository.

## Development

Run the API locally with `npm run start:api`.

## Database

Use a local or hosted PostgreSQL instance. Run the migrations required for your environment before starting the service.
