const mongoose = require("mongoose");

const antrianSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  no_queue: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "WAITING", "COMPLETE", "INCOMPLETE"],
    default: "WAITING",
  },
});

module.exports = mongoose.model("Antrian", antrianSchema, "db_antrian");
