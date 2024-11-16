import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve(); // Ensure compatibility for serving static files

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Books Schema
const BookSchema = new mongoose.Schema({}, { strict: false });
const Book = mongoose.model("Book", BookSchema, "books");

// API Endpoint for Books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find({});
    console.log(books); // Optional: Log fetched data for debugging
    res.json(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
