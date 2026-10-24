FROM node:24.22.1-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl gosu && rm -rf /var/lib/apt/lists/*
WORKDIR /app/portal
COPY portal/package.json portal/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY portal/server.mjs ./
COPY assets/logo.svg /app/assets/logo.svg
RUN mkdir -p /app/web && curl -fL --retry 3 https://github.com/danecohn/AltStackMail/releases/download/altstack-mail-v1.0.0/AltStackMail-web.tar.gz -o /tmp/client.tar.gz && echo '32b9009ec75ca3b5e459544648d0411e55bf0e4f36d1087fbc6f5bb1af3226b8  /tmp/client.tar.gz' | sha256sum -c - && tar -xzf /tmp/client.tar.gz -C /app/web && rm /tmp/client.tar.gz && test -s /app/web/index.html && test -s /app/web/worker.js
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod 755 /app/entrypoint.sh
ENV NODE_ENV=production WEB_DIR=/app/web DATA_DIR=/data PORT=3000
LABEL org.opencontainers.image.title="AltStack Mail and Calendar" org.opencontainers.image.licenses="GPL-3.0-or-later" org.opencontainers.image.source="https://github.com/danecohn/AltStackMail"
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]

