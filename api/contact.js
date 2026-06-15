import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "abinod";
const contactCollectionName =
  process.env.CONTACT_COLLECTION || "contact_submissions";

let mongoClientPromise;

function getMongoClient() {
  if (!mongoUri) {
    const error = new Error("Contact storage is not configured.");
    error.code = "CONTACT_STORAGE_NOT_CONFIGURED";
    throw error;
  }

  mongoClientPromise ??= new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 8000,
  })
    .connect()
    .catch((error) => {
      mongoClientPromise = undefined;
      throw error;
    });

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

function getBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "string") return JSON.parse(request.body);
  return request.body;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    const body = getBody(request);

    if (body.website) {
      return response.status(204).end();
    }

    const result = validateContactSubmission(body);
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
      userAgent: request.headers["user-agent"] || "",
    });

    return response.status(201).json({
      message: "Thanks. Your message has been received.",
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);

    if (error instanceof SyntaxError) {
      return response.status(400).json({
        error: "The request body was not valid JSON.",
      });
    }

    if (error.code === "CONTACT_STORAGE_NOT_CONFIGURED") {
      return response.status(503).json({
        error: "The contact service is not available yet. Please email abinod@online.de.",
        fallbackEmail: "abinod@online.de",
      });
    }

    return response.status(500).json({
      error: "The message could not be sent right now. Please email abinod@online.de.",
      fallbackEmail: "abinod@online.de",
    });
  }
}
