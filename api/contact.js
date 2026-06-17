const contactEmail = "abinod@online.de";

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  return response.status(410).json({
    error:
      "Contact submissions are handled by email. Please send your message to abinod@online.de.",
    fallbackEmail: contactEmail,
  });
}
