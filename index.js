const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const server = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

server.use(cors({ origin: "*" }));
server.use(express.json());

// routes
server.use("/api/auth", require("./controllers/authController"));
server.use("/api/patient", require("./controllers/patientController"));

mongoose
    .connect(MONGO_URI)
    .then(() =>
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    )
    .catch((error) => console.error(error));
