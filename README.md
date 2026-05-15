# ContextRouter

ContextRouter turns messy daily founder notes into the right output: X posts, LinkedIn posts, follow-ups, tasks, investor updates, private warnings, and things to leave out.

It is not a generic AI writing assistant. The core loop is:

    daily dump -> context atoms -> privacy and signal checks -> routed cards -> visual board -> copyable outputs

I built ContextRouter because I kept facing the same problem: every day I had useful context from building, calls, meetings, and notes, but I did not know what each piece should become.

Some context should become a public post. Some should become a follow-up. Some should become a task. Some should go into an investor update. Some should stay private. Some should be ignored.

ContextRouter routes messy daily context into the right output buckets.

## What V1 Includes

- Manual daily dump input
- Optional writing samples for voice matching
- Founder, Student Builder, Operator, and Creator modes
- A seven-bucket visual routing board
- Source atoms, routing reasons, risk levels, and quality checks
- Card detail panel with editable draft text
- Copy actions for cards and detail drafts
- Safe card-level rewrite actions
- Durable recent run history in Neon Postgres, with localStorage as a browser cache
- Schema-validated AI output and deterministic safety validators

## What V1 Intentionally Does Not Build

- Login, accounts, teams, billing, permissions, or multi-user workspaces
- Broad product data storage beyond recent route runs
- Gmail, Calendar, Notion, X, LinkedIn, GitHub, CRM, or publishing integrations
- Auto-posting, scheduling, analytics, notifications, RAG, fine-tuning, queues, or workers

The goal is to prove the core judgment loop first: messy context in, routed outputs out.

## Local Setup

1. Install dependencies:

       npm install

2. Create a local env file from .env.example and set OPENAI_API_KEY and DATABASE_URL.

3. Run the Neon migration:

       npm run db:migrate

4. Run the dev server:

       npm run dev

5. Open http://localhost:3000.

## Environment Variables

- OPENAI_API_KEY: required for real routing and rewrites.
- AI_PROVIDER: currently openai.
- AI_MODEL: optional, defaults to gpt-4o.
- DATABASE_URL: required for Neon Postgres run history. Use a pooled Neon connection string for Vercel.

If OPENAI_API_KEY is missing, the API returns MISSING_API_KEY. If DATABASE_URL is missing or the migration has not run, routing/history endpoints return DATABASE_UNAVAILABLE. Production routes do not return fake routed cards or fake saved history.

## Validation Commands

    npm test
    npm run lint
    npm run db:migrate
    npm run build

## Deployment

Deploy as a standard Next.js app on Vercel. Add OPENAI_API_KEY, optional AI_MODEL, and DATABASE_URL in the Vercel project environment, then run the Neon migration before testing the sample founder flow in production.
