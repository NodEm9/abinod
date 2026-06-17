export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    runtime: "vercel",
    contactMode: "smtp",
    emailConfigured: Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        (process.env.SMTP_FROM || process.env.SMTP_USER),
    ),
  });
}
