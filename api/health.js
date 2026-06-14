export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    runtime: "vercel",
    contactStorage: Boolean(process.env.MONGODB_URI),
  });
}
