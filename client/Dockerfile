# Build stage
FROM node:21-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:21-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

ENV PORT=8080

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
