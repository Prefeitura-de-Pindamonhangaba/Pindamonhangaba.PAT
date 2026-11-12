FROM oven/bun:1.4.4 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG NEXT_BUILD_CPUS=2
ENV NEXT_BUILD_CPUS=${NEXT_BUILD_CPUS} NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM build AS migration
USER bun
CMD ["bun", "run", "db:migrate"]

FROM oven/bun:1.4.4 AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile
COPY --from=build --chown=bun:bun /app/.next ./.next
COPY --from=build --chown=bun:bun /app/public ./public
USER bun
EXPOSE 3000
CMD ["bun", "run", "start", "--hostname", "0.0.0.0"]