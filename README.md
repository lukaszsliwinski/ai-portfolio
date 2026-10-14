This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project structure and documentation

- `app/` contains the pages and layout; `app/api/chat/route.ts` handles chat requests.
- `components/` contains the portfolio sections, chat UI, and reusable UI components.
- `chat/` contains the chat service, configuration, logging, and shared types; `chat/model/provider.ts` integrates Gemini, and `chat/security/` handles validation and rate limiting.
- `chat/knowledge.ts` loads and formats the Markdown knowledge files in `chat/data/`.
- `lib/` contains shared utilities and constants; `public/` contains static assets.
- `Dockerfile` and `docker-compose.yml` define the container deployment.

See the [MVP plan](docs/portfolio-chatbot-mvp-plan.md) for product scope and the [implementation guide](docs/portfolio-chatbot-implementation-guide.md) for the current file structure, architecture, and acceptance criteria. [AGENTS.md](AGENTS.md) contains repository instructions; `CLAUDE.md` references those instructions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
