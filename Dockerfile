FROM node:20-alpine AS backend
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ ./

FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY --from=backend /app ./
COPY --from=frontend-build /app/dist ./public
RUN mkdir -p /app/data
ENV NODE_ENV=production
ENV DATA_DIR=/app/data
EXPOSE 3001
CMD ["node", "src/index.js"]
