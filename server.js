const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({ extended: false }));

app.get("/:id", (req, res) => {
  res.send("API running");
});

// define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`express server on port ${PORT}`));
