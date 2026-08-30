Author Name: Bin Wu
Course Name: SWENG 861 – Software Construction
Description: A task manager CRUD API

# The readme is maintained and edited by copilot AI

## Getting Started

### Prerequisites
- Node.js installed on your system
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the API

Start the server:
```bash
npm start
```

The API will run on `http://localhost:3000`

### Available Endpoints

- `GET /health` - Health check endpoint
  - Response: `{ "status": "ok" }`

- `GET /api/hello` - Hello endpoint
  - Response: `{ "message": "Hello, World!" }`

### Testing

You can test the endpoints using:
- Browser: Navigate to `http://localhost:3000/health`
- cURL: `curl http://localhost:3000/api/hello`
- Postman: Import the endpoint URLs and make GET requests
