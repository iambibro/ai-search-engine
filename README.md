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
```
ai-search-engine/
├── src/                    # Source code
│   ├── controllers/        # API route handlers
│   │   ├── aiSearchControllers.ts
│   │   ├── contextSearchControllers.ts
│   │   ├── generateControllers.ts
│   │   └── userController.ts
│   ├── models/            # Database models
│   │   ├── searchResult.ts
│   │   └── user.ts
│   ├── middleware/        # Request middleware
│   │   └── authMiddleware.ts
│   ├── lib/              # Utility functions
│   │   └── database.ts
│   ├── config/           # Configuration
│   │   └── env.ts
│   └── index.ts          # Main application entry
├── drizzle/              # Database migrations
│   ├── meta/            # Migration metadata
│   └── *.sql            # SQL migration files
├── scripts/             # Database scripts
│   ├── clean-db.ts
│   └── seeds/
│       └── admin-user.ts
├── tests/               # Test files
│   └── __test__/
├── .env                 # Environment variables
├── docker-compose.yml   # Local development
├── docker-compose.prod.yml # Production
├── Dockerfile          # Docker configuration
└── package.json        # Project dependencies
```

## API Endpoints

### Public Endpoints
- `GET /` - Welcome endpoint
  - Returns: Welcome message
  - No authentication required

- `POST /register` - User registration
  - Body: `{ email: string, password: string, name: string }`
  - Returns: `{ id: string, email: string, name: string }`
  - No authentication required

- `POST /login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: `{ token: string }`
  - No authentication required

### Protected Endpoints (Require JWT Token)
- `GET /search` - AI-powered search
  - Query params: `query: string`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Search results with AI analysis

- `GET /generate` - Content generation
  - Query params: `query: string, url: string`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Generated content based on URL and query

- `GET /context-search` - Context-aware search
  - Query params: `query: string, limit?: number`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Contextual search results with semantic analysis

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
