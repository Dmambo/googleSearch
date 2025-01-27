const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 7000;
app.use(bodyParser.json());

// Complete JSON structure for domains and subcategories
const domaines = {
  telecommunications: {
    technologies_reseaux: [
      "Réseau mobile",
      "Réseau 5G",
      "Réseau 4G LTE",
      "Fibre optique",
      "Wi-Fi 6",
      "Internet des objets (IoT)",
      "VoIP",
      "MPLS",
      "VPN",
      "SD-WAN",
      "Ethernet",
      "Cloud computing",
      "Edge computing",
      "Satellite communication",
      "Téléphonie IP",
      "Réseaux privés (PNR)"
    ],
    infrastructure: [
      "Antennes relais",
      "Stations de base (BTS)",
      "Réseaux filaires",
      "Data centers",
      "Câblage sous-marin",
      "Serveurs",
      "Équipement réseau",
      "Modem",
      "Routeurs",
      "Commutateurs"
    ],
    services_applications: [
      "Téléphonie mobile",
      "Services Internet",
      "Streaming vidéo",
      "Messagerie instantanée",
      "Téléconférence",
      "Télévision numérique",
      "Hébergement web",
      "Sécurité réseau",
      "Services cloud",
      "Services OTT"
    ],
    standards_protocoles: [
      "GSM",
      "CDMA",
      "LTE",
      "5G NR",
      "IoT-M",
      "SIP",
      "HTTP/HTTPS",
      "IPv4",
      "IPv6",
      "TCP/IP"
    ],
    innovation_tendances: [
      "Réalité augmentée",
      "Réalité virtuelle",
      "Intelligence artificielle dans les réseaux",
      "Blockchain pour la communication",
      "Open RAN",
      "Communication unifiée",
      "Automatisation réseau"
    ],
    terminologie_commerciale: [
      "Fournisseurs d’accès Internet (FAI)",
      "Opérateurs de télécommunications",
      "Marché B2B/B2C",
      "Plans tarifaires",
      "Solutions réseau d’entreprise",
      "Maintenance réseau",
      "Partenariats technologiques"
    ],
    securite: [
      "Cryptage réseau",
      "Pare-feu",
      "Protection DDoS",
      "Authentification multi-facteurs",
      "Cyberdéfense",
      "Sauvegarde et récupération des données"
    ],
    materiel_equipements: [
      "Smartphone",
      "Tablettes",
      "Clés 4G/5G",
      "Micro-ondes (communication)",
      "Répéteurs",
      "Amplificateurs de signal",
      "Balises IoT"
    ],
    reglementation_standards: [
      "ITU",
      "ETSI",
      "FCC",
      "Réglementations sur la cybersécurité",
      "Confidentialité des données (GDPR, HIPAA)"
    ]
  },
  informatique: {
    technologies: [
      "Développement web",
      "Développement mobile",
      "DevOps",
      "Big Data",
      "Intelligence artificielle",
      "Apprentissage automatique (Machine Learning)",
      "Cloud computing",
      "Blockchain",
      "Réalité virtuelle",
      "Réalité augmentée"
    ],
    programming_languages: [
      "Python",
      "JavaScript",
      "Java",
      "C++",
      "C#",
      "PHP",
      "Ruby",
      "Swift",
      "Kotlin",
      "Go"
    ],
    frameworks: [
      "Laravel",
      "Express",
      "Django",
      "Spring Boot",
      "React",
      "Vue.js",
      "Angular",
      "Flutter",
      "TensorFlow",
      "PyTorch"
    ],
    services: [
      "Hébergement cloud",
      "Bases de données",
      "Services SaaS",
      "Cybersécurité",
      "Maintenance informatique",
      "Solutions ERP",
      "CRM",
      "Analyse de données"
    ],
    infrastructure: [
      "Serveurs",
      "Data centers",
      "Réseaux LAN/WAN",
      "Stockage SAN/NAS",
      "Routeurs",
      "Commutateurs",
      "Pare-feu"
    ],
    securite: [
      "Cryptage des données",
      "Sécurité des applications",
      "Pare-feu",
      "Gestion des identités",
      "Détection des intrusions",
      "Gestion des accès",
      "Protection des données personnelles"
    ],
    methodologies: [
      "Agile",
      "Scrum",
      "Kanban",
      "DevOps",
      "CI/CD",
      "ITIL",
      "Lean IT"
    ]
  }
};

// Configuration for API request
const config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://google.serper.dev/search",
  headers: {
    "X-API-KEY": process.env.SERPER_API_KEY,
    "Content-Type": "application/json",
  },
  data: JSON.stringify({
    q: "Appel d'offre en guinee",
    location: "Guinea",
    gl: "gn",
    hl: "fr",
    tbs: "qdr:d",
  }),
};

async function makeRequest() {
  try {
    const response = await axios.request(config);
    const organicResults = response.data.organic;

    const categorizedResults = {};

    Object.keys(domaines).forEach((domain) => {
      categorizedResults[domain] = {};
      Object.keys(domaines[domain]).forEach((category) => {
        categorizedResults[domain][category] = [];
      });
    });

    organicResults.forEach((result) => {
      const { title, snippet, link } = result;
      let matched = false;

      Object.entries(domaines).forEach(([domain, categories]) => {
        Object.entries(categories).forEach(([category, keywords]) => {
          if (keywords.some((keyword) => title.toLowerCase().includes(keyword.toLowerCase()))) {
            categorizedResults[domain][category].push({ title, snippet, link });
            matched = true;
          }
        });
      });

      if (!matched) {
        if (!categorizedResults.others) categorizedResults.others = [];
        categorizedResults.others.push({ title, snippet, link });
      }
    });

    // Exclude the "others" category
    const filteredResults = { ...categorizedResults };
    delete filteredResults.others;

    // Collect all links from non-empty categories
    let allLinks = [];
    Object.entries(filteredResults).forEach(([domain, categories]) => {
      Object.entries(categories).forEach(([category, items]) => {
        if (items.length > 0) {
          // Add all links in this category to the array
          allLinks = allLinks.concat(items.map((item) => item.link));
        }
      });
    });

    if (allLinks.length > 0) {
      // Convert the links to a string (separated by newlines)
      const linksAsString = allLinks.join("\n");
      console.log("Links found:", linksAsString);

      // Send the links to the webhook
      await axios.post("https://hook.eu1.make.com/5lm97ov5q9zg4qnmhewlrn5qxe11t733", {
        urls: linksAsString,
      });

      console.log("Links sent successfully to webhook.");
    } else {
      console.log("No links found to send.");
    }
  } catch (error) {
    console.error("Error during API request:", error.message);
    throw error;
  }
}

// API route
app.get("/search", async (req, res) => {
  try {
    await makeRequest();
    res.status(200).json({ success: true, message: "Links sent to webhook" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});