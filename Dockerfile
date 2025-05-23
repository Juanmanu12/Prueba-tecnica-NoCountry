FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*json ./

RUN npm install --only=production

COPY . .

RUN npm run builder

FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]