const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const inquiriesRoutes = require("./routes/inquiries");
const commentsRoutes = require("./routes/comments");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/comments", commentsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
