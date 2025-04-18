# ---- Base image ----
FROM oven/bun:1.0 as base
WORKDIR /app
COPY package.json bun.lockb ./

# ---- Development image ----
FROM base as dev
RUN bun install
COPY . .
ENV NODE_ENV=development
# Expose your app port (change if needed)
EXPOSE 3000
CMD ["bun", "src/index.ts"]

# ---- Production image ----
FROM base as build
RUN bun install --production
COPY . .
RUN bun run db:generate
# If you have a build step, uncomment:
# RUN bun run build

FROM oven/bun:1.0 as prod
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "src/index.ts"]
