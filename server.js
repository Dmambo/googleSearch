const { getJson } = require("serpapi");
const express = require("express");
const bodyParser = require("body-parser");
require ("dotenv").config()

const app = express();
const PORT = 6000;

app.use(bodyParser.json());

// Define API key and query
const apiKey = process.env.MY_API_KEY;
const query = "offres de télécommunication publiées aujourd'hui en Guinée Conakry";

// Fetch and Save Data
async function searchAndSave() {
  console.log("Searching for today's telecommunication offers in Guinea Conakry...");

  getJson(
    {
      engine: "google",
      q: query,
      api_key: apiKey,
      tbs: "qdr:d", // Filters results to only the past day
      gl: "gn", // Geolocation for Guinea (ISO country code)
      hl: "fr", // Language for the results (French)
    },
    async (json) => {
      try {
        const results = json["organic_results"];
        if (results && results.length > 0) {
          // Extract URLs and titles
          const urls = results.map((result) => ({
            url: result.link,
            title: result.title,
            snippet: result.snippet, // Optional: Get the offer description/snippet
          }));

          let offers = urls.map((u) => `${u.title}\n${u.url}\n${u.snippet}\n`).join("\n");

          console.log(offers);

          // Send the body as a string
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              offers: offers,
            }),
            redirect: "follow",
          };

          const response = await fetch(
            "https://hook.eu1.make.com/5lm97ov5q9zg4qnmhewlrn5qxe11t733",
            requestOptions
          );

          if (response.ok) {
            console.log("Data sent successfully");
          } else {
            console.error("Failed to send data:", response.status, response.statusText);
          }
        } else {
          console.log("No results found.");
        }
      } catch (error) {
        console.error("Error processing results:", error.message);
      }
    }
  );
}

app.get("/search", (req, res) => {
  searchAndSave()
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
