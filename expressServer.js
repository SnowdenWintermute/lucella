const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const socketio = require("socket.io");

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({ extended: false }));
app.use(helmet());

app.get("/:id", (req, res) => {
  res.send("API running");
});

// define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5000;
const expressServer = app.listen(PORT, () =>
  console.log(`express server on port ${PORT}`)
);
const io = socketio(expressServer);

module.exports = {
  io,
  app
};
