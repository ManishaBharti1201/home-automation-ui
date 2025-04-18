const express = require("express");
const axios = require("axios");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/proxy", async (req, res) => {
  try {
    // Forward the request to the actual SSE endpoint
    const response = await axios({
      method: "get",
      url: "https://sse-fake.andros.dev/events/",
      responseType: "stream",
    });

    // Set the correct Content-Type for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Pipe the SSE stream to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Error in proxy server:", error.message);
    res.status(500).send("Error fetching SSE data");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));