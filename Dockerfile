FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN npm run build

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
