const axios = require('axios');
const express = require("express");
const bodyParser = require("body-parser");
require ("dotenv").config()

const app = express();
const PORT = process.env.PORT || 7000
app.use(bodyParser.json());

let data = JSON.stringify({
  "q": "offres de télécommunication publiées aujourd'hui en Guinée Conakry",
  "location": "Guinea",
  "gl": "gn",
  "hl": "fr",
  "tbs": "qdr:d"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://google.serper.dev/search',
  headers: { 
    'X-API-KEY': process.env.SERPER_API_KEY, 
    'Content-Type': 'application/json'
  },
  data : data
};

async function makeRequest() {
  try {
    const response = await axios.request(config);
    const organicResults = response.data.organic;
    
    // Extract and format the required fields
    const formattedResults = organicResults.map(result => ({
      title: result.title,
      snippet: result.snippet,
      link: result.link,
    }));

    console.log(JSON.stringify(formattedResults, null, 2));
  }
  catch (error) {
    console.log(error);
  }
}


app.get("/search", (req, res) => {
    makeRequest()
      .then(() => {
        res.status(200).send("Search completed successfully.");
      })
      .catch((error) => {
        console.error("Error during search:", error);
        res.status(500).send("Internal Server Error");
      });
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });