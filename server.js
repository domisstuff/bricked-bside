const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
app.use(express.json());

const PORT = 3000;
const API_KEY = "mg/9F2mHzEKoQ0CPxrgL4LLxq2YJqnXVp/7vbUQgBJDZpr9FZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SW0xbkx6bEdNbTFJZWtWTGIxRXdRMUI0Y21kTU5FeE1lSEV5V1VweGJsaFdjQzgzZG1KVlVXZENTa1JhY0hJNVJpSXNJbTkzYm1WeVNXUWlPaUl6TlRneE1EZzROaUlzSW1WNGNDSTZNVGMzTlRJMU9UazROaXdpYVdGMElqb3hOemMxTWpVMk16ZzJMQ0p1WW1ZaU9qRTNOelV5TlRZek9EWjkubkk3dG9Dc3VSM2lYMUpOT3F5T3JCdkZ3V2RFODlQTk8yQzhQeXljMjN2ODNJcF9MUXAzNHdPeVhUR25XRnRBOW5nTVA0WXlQQW1yUXE4OGxkb0xNVm12b09FRHViUFVEdFRKeS1MR1EzY3ZOekJGYWJZbjFPNDkwWW14eUZQZ1VsYzN5cHo5a3pHNTc1MzJONHIyTDRkZWE2aFROOGFtNHdHZDFCb0k2Y3hpR25lRDVXLXg2SmRvUFptcmd2TmRtTTREUXZVN3VXV2lfUkpzQ1p0b0hKNTR2Q2tydWRrZElyMjgyX1BOdF96Vlg2cWFMbnNLc0twZ0RoVWYyN2tPQmx5anU5OFI2N3pQVTV0Rm1WNlVHbjJxbFRQb1pXZ0wxMFdwc0Zad19pWHFSQlVkdU5ma0NnUHRrdkgtOGZKRXlOZFVWMDZPcHRHNlM0Z09obEw4T25R";
const UNIVERSE_ID = "7463863336";
const DATASTORE = "PlayerData";

// Endpoint to start exporting data
app.post("/export", async (req, res) => {
  try {
    let allData = [];
    let cursor = null;

    while (true) {
      const response = await axios.get(
        `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries`,
        {
          headers: { "x-api-key": API_KEY },
          params: {
            datastoreName: DATASTORE,
            limit: 100,
            cursor: cursor,
          },
        }
      );

      const { keys, nextPageCursor } = response.data;

      // Fetch each entry
      for (let key of keys) {
        const entryRes = await axios.get(
          `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`,
          {
            headers: { "x-api-key": API_KEY },
            params: {
              datastoreName: DATASTORE,
              entryKey: key,
            },
          }
        );
        allData.push({ key, value: entryRes.data.value });
      }

      if (!nextPageCursor) break;
      cursor = nextPageCursor;
    }

    // Save all data to a JSON file
    fs.writeFileSync("exportedData.json", JSON.stringify(allData, null, 2));
    res.json({ message: "Export complete", total: allData.length });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Export failed" });
  }
});

// Endpoint for new game to download the data
app.get("/download-all-data", (req, res) => {
  try {
    const data = fs.readFileSync("exportedData.json");
    res.header("Content-Type", "application/json");
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: "No data available" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
