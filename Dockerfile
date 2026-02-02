# Development stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p /app/storage /app/logs

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

RUN mkdir -p /app/storage /app/logs

USER node

EXPOSE 3000

CMD ["node", "dist/main"]

