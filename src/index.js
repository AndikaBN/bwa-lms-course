import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import globalRoute from "./routes/globalRoute.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/database.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import courseRoutes from "./routes/courseRoute.js";

const app = express();
dotenv.config();

connectDB();

const port = 3000;

// Konfigurasi CORS
app.use(cors());

// Konfigurasi body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json({
        text: "aku suka susunya hingga tetes terakhir aku suka coklatnya hingga tetes terakhir",
    });
});

// Routes
app.use("/api", globalRoute);
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);
app.use("/api", courseRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});