const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 3001;
const FEEDBACK_FILE = path.join(__dirname, "feedback.csv");

// Middleware
app.use(cors());
app.use(express.json());

// CSV writer configuration
const csvWriter = createCsvWriter({
  path: FEEDBACK_FILE,
  header: [
    { id: "id", title: "ID" },
    { id: "name", title: "Name" },
    { id: "email", title: "Email" },
    { id: "message", title: "Message" },
    { id: "votes", title: "Votes" },
    { id: "createdAt", title: "Created At" },
  ],
});

// Helper functions for CSV storage
async function readFeedbackFromCSV() {
  return new Promise((resolve, reject) => {
    const feedback = [];

    // Check if file exists first
    fs.access(FEEDBACK_FILE)
      .then(() => {
        // File exists, read it
        const stream = require("fs").createReadStream(FEEDBACK_FILE);
        stream
          .pipe(csv())
          .on("data", (data) => {
            // Skip empty rows or rows with missing essential data
            if (
              !data.ID ||
              !data.Name ||
              !data.Email ||
              !data.Message ||
              !data["Created At"]
            ) {
              return;
            }

            // Convert votes to number and ensure proper data types
            feedback.push({
              id: data.ID,
              name: data.Name,
              email: data.Email,
              message: data.Message,
              votes: parseInt(data.Votes) || 0,
              createdAt: data["Created At"],
            });
          })
          .on("end", () => {
            resolve(feedback);
          })
          .on("error", (error) => {
            reject(error);
          });
      })
      .catch(() => {
        // File doesn't exist, return empty array
        resolve([]);
      });
  });
}

async function writeFeedbackToCSV(feedback) {
  // Transform data to match CSV headers
  const csvData = feedback.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    message: item.message,
    votes: item.votes,
    createdAt: item.createdAt,
  }));

  // Delete the existing file first to ensure we start fresh
  try {
    await fs.unlink(FEEDBACK_FILE);
  } catch (err) {
    // File might not exist, which is okay
  }

  // Create a new CSV writer instance
  const csvWriter = createCsvWriter({
    path: FEEDBACK_FILE,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "message", title: "Message" },
      { id: "votes", title: "Votes" },
      { id: "createdAt", title: "Created At" },
    ],
  });

  // Write all records to the CSV file (this will include the header)
  await csvWriter.writeRecords(csvData);
}

// API Routes

// GET all feedback
app.get("/feedback", async (req, res) => {
  try {
    const feedback = await readFeedbackFromCSV();
    res.json(feedback);
  } catch (error) {
    console.error("Error reading feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// POST new feedback
app.post("/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const newFeedback = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      votes: 0,
      createdAt: new Date().toISOString(),
    };

    const feedback = await readFeedbackFromCSV();
    feedback.push(newFeedback);
    await writeFeedbackToCSV(feedback);

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ error: "Failed to create feedback" });
  }
});

// PUT update votes
app.put("/feedback/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'upvote' or 'downvote'

    if (!type || !["upvote", "downvote"].includes(type)) {
      return res
        .status(400)
        .json({ error: 'Vote type must be "upvote" or "downvote"' });
    }

    const feedback = await readFeedbackFromCSV();
    const feedbackIndex = feedback.findIndex((f) => f.id === id);

    if (feedbackIndex === -1) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    if (type === "upvote") {
      feedback[feedbackIndex].votes += 1;
    } else {
      feedback[feedbackIndex].votes -= 1;
    }

    await writeFeedbackToCSV(feedback);
    res.json(feedback[feedbackIndex]);
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Failed to update vote" });
  }
});

// DELETE feedback
app.delete("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await readFeedbackFromCSV();
    const filteredFeedback = feedback.filter((f) => f.id !== id);

    if (feedback.length === filteredFeedback.length) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    await writeFeedbackToCSV(filteredFeedback);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
