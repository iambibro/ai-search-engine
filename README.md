# ai-search-engine

A full-stack AI-powered search engine using Bun, Drizzle ORM, PostgreSQL with pgvector, and LangChain integrations.

## Features
- AI-augmented search with vector embeddings
- PostgreSQL + pgvector for semantic similarity
- Bun for fast JS/TS runtime
- Drizzle ORM for type-safe DB access
- Dockerized for easy local/prod deployment

---

## Prerequisites
- [Bun](https://bun.sh/) (v1.2.10+)
- [Docker](https://www.docker.com/) (for local DB/dev)

---

## Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd ai-search-engine
```

### 2. Install dependencies
```bash
bun install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the required values (such as `DATABASE_URL`). Example:

```
DATABASE_URL=postgres://postgres:admin@localhost:5432/ai_search
# Add any API keys or other secrets here
```

### 4. Start PostgreSQL with pgvector (Docker)
For local development:
```bash
docker compose up -d
```
This uses the `pgvector/pgvector:pg16` image and exposes DB on port 5432.

### 5. Run Database Migrations
Generate and apply the schema:
```bash
bun db:generate
bun db:migrate
```

### 6. (Optional) Seed the Database
```bash
bun db:seed
```

---

## Running the App

### Development
```bash
bun dev
```
Or directly:
```bash
bun src/index.ts
```

### Production (Docker Compose)
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

---

## Common Scripts
- `bun dev` — Start dev server
- `bun db:generate` — Generate migrations
- `bun db:migrate` — Apply migrations
- `bun db:push` — Sync DB schema
- `bun db:clean` — Clean DB (dev only)
- `bun db:seed` — Seed DB with admin user

---

## Project Structure
- `src/` — Source code (controllers, models, lib, etc.)
- `drizzle/` — Generated migration files
- `scripts/` — DB and seed scripts
- `Dockerfile` — Multi-stage build for dev/prod
- `docker-compose.yml` — Local DB (pgvector)
- `docker-compose.prod.yml` — App + DB for production

---

## Notes
- Requires Bun runtime for all scripts
- Uses Drizzle ORM with PostgreSQL and pgvector extension
- For advanced vector search, indexes use `ivfflat` and `vector_l2_ops` (see `src/models/searchResult.ts`)
- API keys for LangChain integrations should be set in `.env`

---

## References
- [Bun](https://bun.sh/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [pgvector](https://github.com/pgvector/pgvector)
- [LangChain](https://js.langchain.com/)

---

For any issues, please open an issue or PR.
