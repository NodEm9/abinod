import "dotenv/config";

import express from "express";
import { MongoClient } from "mongodb";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "abinod";
const contactCollectionName =
  process.env.CONTACT_COLLECTION || "contact_submissions";

let mongoClientPromise;

function getMongoClient() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  mongoClientPromise ??= new MongoClient(mongoUri).connect();
  return mongoClientPromise;
}

function cleanText(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function validateContactSubmission(body) {
  const submission = {
    name: cleanText(body.name, 120),
    email: cleanText(body.email, 160).toLowerCase(),
    topic: cleanText(body.topic, 80),
    message: String(body.message || "").trim().slice(0, 4000),
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!submission.name) return { error: "Please enter your name." };
  if (!emailPattern.test(submission.email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!submission.topic) return { error: "Please select a topic." };
  if (submission.message.length < 10) {
    return { error: "Please include a short message." };
  }

  return { submission };
}

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.post("/api/contact", async (request, response) => {
  try {
    if (request.body.website) {
      return response.status(204).end();
    }

    const result = validateContactSubmission(request.body);
    if (result.error) {
      return response.status(400).json({ error: result.error });
    }

    const client = await getMongoClient();
    const collection = client.db(mongoDbName).collection(contactCollectionName);

    await collection.insertOne({
      ...result.submission,
      source: "abinod-website",
      status: "new",
      createdAt: new Date(),
      userAgent: request.get("user-agent") || "",
    });

    response.status(201).json({
      message: "Thanks. Your message has been received.",
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    response.status(500).json({
      error: "The message could not be sent right now. Please try again later.",
    });
  }
});

app.use(
  express.static(__dirname, {
    extensions: ["html"],
  }),
);

app.listen(port, () => {
  console.log(`Abinod website running at http://localhost:${port}`);
});
