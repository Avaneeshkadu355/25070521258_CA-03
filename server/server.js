
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Transaction schema
const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

// Basic health route
app.get("/", (req, res) => {
  res.json({ message: "Vaultly API is running!" });
});

// Check database connection
app.get("/api/health", (req, res) => {
  res.json({
    server: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Get all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch transactions." });
  }
});

// Save a transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, category, amount, date, description } = req.body;

    if (
      !title ||
      !category ||
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount))
    ) {
      return res.status(400).json({
        message: "Title, category, and a valid amount are required."
      });
    }

    const transaction = await Transaction.create({
      title,
      category,
      amount: Number(amount),
      date,
      description
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Could not save transaction." });
  }
});

// Start only after MongoDB connects
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Vaultly server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
