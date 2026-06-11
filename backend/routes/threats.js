const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../data/threats.json"
);

const readThreats = () => {
  try {
    return JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
  } catch {
    return [];
  }
};

router.get("/", (req, res) => {
  res.json(readThreats());
});

router.post("/", (req, res) => {
  try {
    const threats = readThreats();

    const newThreat = {
      id: Date.now(),
      ...req.body,
    };

    threats.push(newThreat);

    fs.writeFileSync(
      filePath,
      JSON.stringify(threats, null, 2)
    );

    res.json({
      success: true,
      threat: newThreat,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add threat",
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    let threats = readThreats();

    threats = threats.filter(
      (threat) => threat.id !== id
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(threats, null, 2)
    );

    res.json({
      success: true,
      message: "Threat deleted",
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