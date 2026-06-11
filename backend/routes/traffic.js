const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../data/traffic.json"
);

const readTraffic = () => {
  try {
    return JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
  } catch {
    return [];
  }
};

router.get("/", (req, res) => {
  res.json(readTraffic());
});

router.post("/", (req, res) => {
  try {
    const traffic = readTraffic();

    const newZone = {
      id: Date.now(),
      ...req.body,
    };

    traffic.push(newZone);

    fs.writeFileSync(
      filePath,
      JSON.stringify(traffic, null, 2)
    );

    res.json({
      success: true,
      traffic: newZone,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add traffic zone",
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    let traffic = readTraffic();

    traffic = traffic.filter(
      (zone) => zone.id !== id
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(traffic, null, 2)
    );

    res.json({
      success: true,
      message: "Traffic zone deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

module.exports = router;