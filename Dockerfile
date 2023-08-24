FROM node:18-slim

WORKDIR /home/node/app

RUN apt-get update -y && apt-get install -y openssl

CMD [ "tail", "-f", "/dev/null" ]