# Abinod Website

Official website for Abinod, a founder-led software company building infrastructure products for modern applications.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the site:

```bash
npm start
```

By default, the site runs at `http://localhost:3000`.

## Contact Form

The contact form posts to `/api/contact` and stores submissions in MongoDB.

Create a local `.env` file from `.env.example`:

```bash
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=abinod
CONTACT_COLLECTION=contact_submissions
```

Do not commit `.env`.

## Pages

- Home
- Products
- Ecosystem
- About
- Founder
- Mission
- Brand Essence
- Contact
- Ambiten Docs entry point

## Open Graph

The site uses `assets/og-abinod.png` as the shared Open Graph and Twitter card image.
