

# ChargeGPT API

This repository contains the public API backend for ChargeGPT.

## Setup

1. Install dependencies with `npm ci`.
2. Create a local `.env` file from your deployment values.
3. Configure your database, queue, S3, and Sentry settings locally.

## Environment

The backend is configured entirely through environment variables. Public releases should not include hardcoded tokens, private URLs, or customer-specific credentials.

## Development

Run the API locally with `npm run start:api`.

## Database

Use your local or hosted PostgreSQL instance and run the migration steps required by your environment before starting the service.
