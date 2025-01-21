# Google Search API Project Documentation

## Overview
This project is a Node.js application that searches for telecommunication job offers in Guinea Conakry using the SerpApi Google Search API. It filters results to show only today's postings and sends the collected data to a webhook endpoint.

## Technical Stack
- Node.js
- Express.js
- SerpApi
- Body Parser

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables
The following variables are configured in the application:
- `PORT`: 6000 (default)
- `API_KEY`: SerpApi API key
- Webhook URL from Make: `https://hook.eu1.make.com/5lm97ov5q9zg4qnmhewlrn5qxe11t733`

## API Endpoints

### GET /search
Initiates a search for telecommunication job offers.

**Response:**
- 200: "Search completed successfully"
- 500: "Internal Server Error"

## Core Functions

### searchAndSave()
The main function that:
1. Performs Google search using SerpApi
2. Filters results for today's posts
3. Extracts URLs and titles
4. Sends data to webhook

Search Parameters:
```javascript
{
    engine: "google",
    q: query,
    api_key: apiKey,
    tbs: "qdr:d",    // Daily results
    gl: "gn",        // Guinea location
    hl: "fr"         // French language
}
```

## Data Processing
The application processes search results in the following way:
1. Extracts organic results from the API response
2. Maps results to get URLs and titles
3. Formats data as a string with URLs
4. Sends formatted data to webhook endpoint

## Error Handling
The application includes error handling for:
- API search failures
- Data processing errors
- Webhook communication errors

## Dependencies
```json
{
  "dependencies": {
    "body-parser": "^1.20.3",
    "csv-writer": "^1.6.0",
    "express": "^4.21.2",
    "serpapi": "^2.1.0"
  }
}
```

## Running the Application
Start the server:
```bash
node index.js
```

The server will start on port 6000 by default.

## Security Considerations
- API key is currently hardcoded and should be moved to environment variables
- Webhook URL should be configured via environment variables
- Consider implementing rate limiting
- Add input validation for search parameters

## Future Improvements
1. Implement environment variable configuration
2. Add data persistence layer
3. Implement rate limiting
4. Add authentication for API endpoints
5. Add more robust error handling
6. Implement logging system
7. Add test coverage
          
## Notes
- The application is specifically designed for French language job searches in Guinea
- Results are filtered to exclude certain domains (-site:fr -site:sn -site:ci)
- The webhook endpoint should be configured to handle the specific data format being sent