FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json .

RUN npm ci

FROM node:24-alpine AS  builder

WORKDIR /app 

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_TMDB_IMAGE_BASE_URL

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=$NEXT_PUBLIC_TMDB_IMAGE_BASE_URL
ENV HOSTNAME=0.0.0.0

RUN npm run build 

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir -p .next/cache/images \
    && chown -R node:node .next

USER node

EXPOSE 3000

#CMD ["node_modules/.bin/next", "start"]
CMD ["node", "server.js"]
