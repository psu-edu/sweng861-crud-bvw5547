Author Name: Bin Wu
Course Name: SWENG 861 - Software Construction
Description: A task manager CRUD API

# The readme is maintained and edited by copilot AI

## Getting Started

### Prerequisites

- Node.js installed on your system
- npm (comes with Node.js)
- An AWS account with DynamoDB access

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and add your Google OAuth credentials and a long random session secret. The AWS SDK uses your configured AWS CLI credentials.

```powershell
Copy-Item .env.example .env
```

### Running the API

```bash
npm start
```

The API runs on `http://localhost:3000`.

### Endpoints

- `GET /health` returns `{ "status": "ok" }`.
- `GET /auth/login` starts Google login.
- `GET /api/hello` is protected and requires a valid login.
- `POST /auth/logout` ends the session.

## Authentication Strategy

This project uses **Option A: Social Login** with Google OAuth 2.0 because Google provides the identity verification and the application does not need to store passwords. A user selects the Google login link, is redirected to Google, and returns to the application through `/auth/callback`. The backend stores the Google user identity in DynamoDB and creates a local session.

## Protected Endpoint Description

`GET /api/hello` is protected by the reusable `requireAuth` middleware. The middleware checks the current session before the route handler runs, returns `401 Unauthorized` when the user is not authenticated, and allows authenticated requests to receive a greeting containing only the current user's email or name.

## OWASP Practices

- Avoid excessive data exposure by returning only the greeting instead of the complete user record.
- Avoid BOLA by using only the identity attached to the current authenticated session.
- Avoid security misconfiguration by returning generic authentication errors without stack traces.
