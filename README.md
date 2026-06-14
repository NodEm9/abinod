<p align="center">
  <img src="assets/abinod-mark.svg" alt="Abinod logo" width="96" />
</p>

# Abinod

Official website for [Abinod](https://www.abinod.com/), a founder-led software company building infrastructure products for modern applications.

Abinod exists to create products that help software remain understandable as it grows. Its first product is Ambiten, a context-aware runtime for modern multi-tenant systems.

## Live Site

[https://www.abinod.com/](https://www.abinod.com/)

## What Is Included

- Company homepage
- Products page
- Ecosystem page
- About page
- Founder page
- Mission page
- Brand Essence page
- Blog and first essay
- Contact page with MongoDB-backed form submission
- Ambiten documentation entry point
- Shared Open Graph image
- Mobile navigation
- Light and dark mode
- First-visit site guide
- Cookie consent banner
- Service worker for static asset caching

## Tech Stack

- Node.js
- Express
- MongoDB Node.js driver
- Static HTML, CSS, and JavaScript
- Service worker
- GitHub Actions for production readiness checks

## Run Locally

Install dependencies:

```bash
npm install
```

Start the production server locally:

```bash
npm start
```

Start the development server with Node watch mode:

```bash
npm run dev
```

By default, the site runs at:

```text
http://localhost:3000
```

## Environment Variables

Create a local `.env` file from `.env.example`:

```bash
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=abinod
CONTACT_COLLECTION=contact_submissions
```

Do not commit `.env`.

## Contact Form

The contact form posts to:

```text
POST /api/contact
```

Valid submissions are stored in MongoDB using the configured `MONGODB_URI`, database name, and collection name.

The endpoint also validates required fields and includes a honeypot field for basic bot filtering.

If submissions return a contact-service error, confirm that the production host has `MONGODB_URI` configured as an environment variable. Static-only hosting will serve the pages, but it will not run the Express `/api/contact` endpoint.

## Cookies And Consent

The website shows a bottom consent banner for first-time visitors. Visitors can accept all optional cookies, reject optional cookies, or save preferences for preference and analytics cookies.

The consent choice is stored in a first-party cookie named:

```text
abinod_cookie_consent
```

## Service Worker

The site registers `sw.js` to cache core static assets for faster repeat visits and basic offline resilience.

## Production Workflow

The production GitHub Actions workflow lives at:

```text
.github/workflows/production.yml
```

It runs on pushes to `main` and can also be started manually from GitHub Actions.

The workflow:

- Installs dependencies with `npm ci`
- Checks JavaScript syntax
- Starts the production server
- Smoke-tests the main public routes
- Smoke-tests contact form validation
- Prints server logs if something fails

## Open Graph

The website uses this shared Open Graph and Twitter card image:

```text
assets/og-abinod.png
```

## Project Structure

```text
.
├── about/
├── assets/
├── blog/
├── brand-essence/
├── contact/
├── docs/
├── ecosystem/
├── founder/
├── mission/
├── products/
├── server.js
├── styles.css
└── package.json
```

## Brand Principle

Strong foundations create stronger systems.
