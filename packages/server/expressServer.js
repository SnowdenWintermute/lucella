const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const socketio = require("socket.io");
const cors = require('cors')
require('dotenv').config();

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({ extended: false }));
app.use(helmet());

app.use(cors())
// define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/gameRecords", require("./routes/api/gameRecords"));

const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// process.env.PORT ||
const PORT = process.env.PORT || 8080;
const expressServer = app.listen(PORT, () =>
  console.log(`express server on port ${PORT}`),
);
const io = socketio(expressServer, {
  cors: {
    methods: ['GET', 'PATCH', 'POST', 'PUT'],
    origin: true,
  },
});

module.exports = {
  io,
  app,
};

