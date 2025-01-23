# Google Search API Project Documentation

## Overview
This project is a Node.js application that searches for telecommunication job offers in Guinea Conakry using two search APIs:
1. SerpApi Google Search API (via Express server)
2. Serper.dev API (direct implementation)

The application filters results to show only today's postings and can send the collected data to a webhook endpoint.

## Technical Stack
- Node.js
- Express.js
- Axios
- SerpApi
- Body Parser
- dotenv

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory with:
- `MY_API_KEY`: SerpApi API key
- `SERPER_API_KEY`: Serper.dev API key
- `PORT`: 6000 (default)

## API Implementations

### 1. Express Server Implementation (SerpApi)
#### Endpoints
##### GET /search
Initiates a search for telecommunication job offers using SerpApi.

**Response:**
- 200: "Search completed successfully"
- 500: "Internal Server Error"

#### Core Function: searchAndSave()
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

### 2. Direct Implementation (Serper.dev)
#### Core Function: makeRequest()

## Search Parameters

### SerpApi Configuration
```javascript
{
    engine: "google",
    q: "offres d'emploi télécommunication Guinée Conakry",
    api_key: process.env.MY_API_KEY,
    tbs: "qdr:d",
    gl: "gn",
    hl: "fr"
}
```

### Serper.dev Configuration
```javascript
{
    q: "offres de télécommunication publiées aujourd'hui en Guinée Conakry",
    location: "Guinea",
    gl: "gn",
    hl: "fr",
    tbs: "qdr:d"
}
```

## Data Processing
The application processes search results by:
1. Extracting organic results from the API response
2. Mapping results to get URLs and titles
3. Formatting data as a string with URLs
4. Optionally sending formatted data to webhook endpoint

## Error Handling
The application includes error handling for:
- API search failures
- Data processing errors
- Webhook communication errors
- Environment variable configuration

## Dependencies
```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "body-parser": "^1.20.3",
    "csv-writer": "^1.6.0",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "serpapi": "^2.1.0"
  }
}
```

## Running the Application

### Express Server
```bash
node index.js
```
The server will start on port 6000 by default.

### Direct Serper Implementation
```bash
node server.js
```

## Security Considerations
- ✅ API keys are configured via environment variables
- ⚠️ Webhook URL should be configured via environment variables
- Consider implementing rate limiting
- Add input validation for search parameters

## Future Improvements
1. Consolidate the two implementations into a single, configurable service
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
- Both SerpApi and Serper.dev implementations are maintained for flexibility