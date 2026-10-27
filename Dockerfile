FROM node:24.22.1-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl gosu && rm -rf /var/lib/apt/lists/*
WORKDIR /app/portal
COPY portal/package.json portal/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY portal/server.mjs ./
COPY assets/logo.svg /app/assets/logo.svg
COPY assets/logo.png /app/assets/logo.png
COPY assets/cohnsoft /app/assets/cohnsoft
COPY scripts/rebrand-web.mjs /app/rebrand-web.mjs
RUN mkdir -p /app/web && curl -fL --retry 3 https://github.com/danecohn/AltStackMail/releases/download/altstack-mail-v1.0.3/AltStackMail-web.tar.gz -o /tmp/client.tar.gz && echo 'd6a50075e0b6a8aad2a3f9cb754de1608696138ccce1b682940290e2f1fa5598  /tmp/client.tar.gz' | sha256sum -c - && tar -xzf /tmp/client.tar.gz -C /app/web && rm /tmp/client.tar.gz && test -s /app/web/index.html && test -s /app/web/worker.js
# Keep the verified client build stable; apply this revision's owned presentation assets.
COPY assets/altstack.css assets/altstack.js /app/web/
COPY assets/logo.svg /app/web/images/altstack-logo.svg
RUN node /app/rebrand-web.mjs /app/web /app/assets
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod 755 /app/entrypoint.sh
ENV NODE_ENV=production WEB_DIR=/app/web DATA_DIR=/data PORT=3000
LABEL org.opencontainers.image.title="Cohnsoft Mail & Calendar" org.opencontainers.image.licenses="GPL-3.0-or-later" org.opencontainers.image.source="https://github.com/danecohn/AltStackMail"
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]

