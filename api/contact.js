import nodemailer from "nodemailer";

const contactEmail = process.env.CONTACT_TO || "abinod@online.de";
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

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
    topic: cleanText(body.topic, 100),
    message: String(body.message || "").trim().slice(0, 4000),
    website: cleanText(body.website, 120),
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (submission.website) return { spam: true };
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

function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    const error = new Error("SMTP is not configured.");
    error.code = "SMTP_NOT_CONFIGURED";
    throw error;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function buildEmailText(submission) {
  return [
    "New Abinod contact message",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Topic: ${submission.topic}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");
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
    const result = validateContactSubmission(body);

    if (result.spam) {
      return response.status(204).end();
    }

    if (result.error) {
      return response.status(400).json({ error: result.error });
    }

    const transporter = getTransporter();
    const subject = `Abinod contact: ${result.submission.topic}`;

    await transporter.sendMail({
      from: `"Abinod Website" <${smtpFrom}>`,
      to: contactEmail,
      replyTo: result.submission.email,
      subject,
      text: buildEmailText(result.submission),
    });

    return response.status(200).json({
      message: "Thanks. Your message has been sent.",
    });
  } catch (error) {
    console.error("Contact email failed:", error);

    if (error instanceof SyntaxError) {
      return response.status(400).json({
        error: "The request body was not valid JSON.",
      });
    }

    if (error.code === "SMTP_NOT_CONFIGURED") {
      return response.status(503).json({
        error: "Email delivery is not configured yet. Please email abinod@online.de.",
        fallbackEmail: contactEmail,
      });
    }

    return response.status(500).json({
      error: "The message could not be sent right now. Please email abinod@online.de.",
      fallbackEmail: contactEmail,
    });
  }
}
