FROM node:18-slim

WORKDIR /home/node/app

RUN apt-get update -y && apt-get install -y openssl

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "start:prod" ]