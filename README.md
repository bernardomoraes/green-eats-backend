# Green Eats - Backend API

## Description

This is the backend API for the Green Eats app. It is built with NestJs and uses a PostgreSQL database. It is deployed on AWS EC2.

## Installation

```bash
$ npm install
```

## Running the app

If you have docker installed, you can run the app locally with the following commands:

At the root of the project, create a .env file with the following the .env.example file.

Then run the following commands:

```bash
# Local
$ docker-compose up -d --build

$ npm run start:dev
```

Now you can access the API at http://localhost:3000
