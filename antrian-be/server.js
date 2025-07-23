const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const antrianRoutes = require("./routes/antrian");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/antrian", antrianRoutes);

mongoose
  .connect("mongodb://localhost:27017/db_antrian", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB Error:", err));
