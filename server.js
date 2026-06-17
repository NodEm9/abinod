import "dotenv/config";

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.get("/api/health", (request, response) => {
  response.json({
    ok: true,
    runtime: "local-express",
    contactMode: "email",
  });
});

app.post("/api/contact", (request, response) => {
  response.status(410).json({
    error:
      "Contact submissions are handled by email. Please send your message to abinod@online.de.",
    fallbackEmail: "abinod@online.de",
  });
});

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({
      error: "The request body was not valid JSON.",
    });
  }

  next(error);
});

app.use(
  express.static(__dirname, {
    extensions: ["html"],
  }),
);

app.listen(port, () => {
  console.log(`Abinod website running at http://localhost:${port}`);
});
