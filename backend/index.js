const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/UserRoutes");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Specify allowed origins without trailing slashes
app.use(cors({
  origin: ['https://entertainment-full-stack-project.vercel.app'],
}));

app.use(express.json());

// API to render html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Handle CORS preflight requests for all routes
app.options('*', cors());

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
