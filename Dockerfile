FROM node:20

WORKDIR /home/node/app

COPY . .

RUN apt-get update -y && apt-get install -y openssl

RUN npm install

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "start:prod"]