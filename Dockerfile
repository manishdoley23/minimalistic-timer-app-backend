FROM node:21-slim AS base

WORKDIR /app

COPY package.json ./

RUN yarn install

FROM base AS development

COPY . .

EXPOSE 8081

CMD ["yarn", "dev"]