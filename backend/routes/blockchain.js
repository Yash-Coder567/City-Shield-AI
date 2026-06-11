const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../data/blockchain.json"
);

const readBlockchain = () => {
  try {
    return JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
  } catch {
    return [];
  }
};

router.get("/", (req, res) => {
  res.json(readBlockchain());
});

router.post("/", (req, res) => {
  try {
    const logs = readBlockchain();

    const newRecord = {
      id: Date.now(),
      ...req.body,
    };

    logs.push(newRecord);

    fs.writeFileSync(
      filePath,
      JSON.stringify(logs, null, 2)
    );

    res.json({
      success: true,
      record: newRecord,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add record",
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    let logs = readBlockchain();

    logs = logs.filter(
      (log) => log.id !== id
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(logs, null, 2)
    );

    res.json({
      success: true,
      message: "Record deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const logs = readBlockchain();

    const updatedLogs = logs.map((log) =>
      log.id === id
        ? { ...log, ...req.body }
        : log
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(updatedLogs, null, 2)
    );

    res.json({
      success: true,
      message: "Record updated",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});

router.delete("/", (req, res) => {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify([], null, 2)
    );

    res.json({
      success: true,
      message: "All records deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;