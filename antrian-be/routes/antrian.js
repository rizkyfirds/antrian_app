const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Antrian = require("../models/Antrian");
const SECRET_KEY = "antrianapp";
const mongoose = require("mongoose");

const USER = {
  username: "admin",
  password: "admin123",
};

const getNextSequence = async (name) => {
  const counter = await mongoose.connection.db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

  if (!counter || !counter.seq || typeof counter.seq !== "number") {
    throw new Error(
      `somethings wrong with counter`
    );
  }

  return counter.seq;
};


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Antrian.find().sort({ no_queue: 1 }).skip(skip).limit(limit),
      Antrian.countDocuments()
    ]);

    res.json({
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/lastQueue", async (req, res) => {
  try {
    const data = await Antrian.findOne().sort({ no_queue: -1 });
    res.json(data.no_queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/currentQueue", async (req, res) => {
  try {
    const data = await Antrian.findOne({ status: "ACTIVE" }).sort({
      no_queue: -1,
    });
    res.json(data.no_queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newQueueNumber = await getNextSequence("no_antrian");

    const activeAntrian = await Antrian.findOne({ status: "ACTIVE" });

    const newAntrian = new Antrian({
      ...req.body,
      no_queue: newQueueNumber,
      status: activeAntrian ? "WAITING" : "ACTIVE",
    });

    const saved = await newAntrian.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ accessToken: token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Antrian.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Antrian tidak ditemukan" });
    }

    if (status !== "ACTIVE") {
      const nextAntrian = await Antrian.findOne({
        no_queue: { $gt: updated.no_queue },
        status: "WAITING",
      }).sort({ no_queue: 1 });

      if (nextAntrian) {
        nextAntrian.status = "ACTIVE";
        await nextAntrian.save();
      }
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
