# Build stage
FROM node:21-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_MEMBERSTACK_PUBLIC_KEY
ENV VITE_MEMBERSTACK_PUBLIC_KEY=$VITE_MEMBERSTACK_PUBLIC_KEY
ARG VITE_PLAN_FREE_ID
ENV VITE_PLAN_FREE_ID=$VITE_PLAN_FREE_ID
ARG VITE_PLAN_PRO_ID
ENV VITE_PLAN_PRO_ID=$VITE_PLAN_PRO_ID

RUN npm run build

# Production stage
FROM node:21-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

ENV PORT=8080

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
