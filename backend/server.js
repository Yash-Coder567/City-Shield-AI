const express = require("express");
const cors = require("cors");

const threatsRoute = require("./routes/threats");
const trafficRoute = require("./routes/traffic");
const blockchainRoute = require("./routes/blockchain");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, /^https:\/\/.*\.vercel\.app$/]
    : true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/threats", threatsRoute);
app.use("/api/traffic", trafficRoute);
app.use("/api/blockchain", blockchainRoute);

app.get("/", (req, res) => {
  res.send("EL-City Shield AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});