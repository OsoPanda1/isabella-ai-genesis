# Isabella Genesis — Production Dockerfile (P1 hardening)
# Base minimal, non-root, pinned dependencies, SBOM-ready
FROM node:22-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app
# Non-root user
RUN addgroup -S isabella && adduser -S isabella -G isabella
# Dependencies (pinned via pnpm-lock.yaml)
COPY pnpm-lock.yaml package.json ./
RUN corepack enable && corepack prepare pnpm@10.34.5 --activate && pnpm install --frozen-lockfile --prod=false
COPY . .
RUN pnpm run build
# Runtime minimal
FROM node:22-alpine AS runtime
RUN apk add --no-cache dumb-init && addgroup -S isabella && adduser -S isabella -G isabella
WORKDIR /app
COPY --from=base /app/.output ./ .output
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml
USER isabella
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://localhost:3000/api/health/live').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]
