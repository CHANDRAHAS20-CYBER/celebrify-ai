# Dockerfile for backend/ only. Build from the project root:
#   docker build -f deployment/Dockerfile -t celebrify-backend .
FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

COPY backend/ ./

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
