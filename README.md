<h1 align="center">NestJS & MongoDB API Starter Kit</h1>

<p align="center">
    <a href="#"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" title="NestJS"/></a>
    <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" title="Node.js"/></a>
    <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" title="TypeScript"/></a>
    <a href="#"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" title="MongoDB"/></a>
    <a href="#"><img src="https://img.shields.io/badge/SWC-FFFFFF?style=for-the-badge&logo=swc&logoColor=black" title="SWC"/></a>
    <a href="#"><img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" title="Jest"/></a>
    <a href="#"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" title="Docker"/></a
    <a href="#"><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" title="Swagger"/></a
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)
- [File Structure](#file-structure)
- [Docker](#docker)

## Description

When the program start a message will be shown:

```
  App is listening...
  App Name: nestjs-mongo-starter-kit
  Version: 0.0.1
  Port: 3000
  Username: oneill
```

For testing the app is working properly, there is a `ping` middleware:

```
http://localhost:3000/api/ping
```

and get the following response:

```json
{
  "name": "nestjs-mongo-starter-kit",
  "port": 3000,
  "version": "1.0.0"
}
```

on every request the program log it to a file and the console, using `winston` and `winston-daily-rotate-file`, for example:

```
[19:00:00] INFO: GET /api/ping 200 2ms
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## File Structure

```
.
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── common/
│   │   ├── providers/
│   │   │   └── config.service.ts
│   │   └── common.module.ts
│   ├── config/
│   │   ├── config.ts
│   │   ├── config.utils.ts
│   │   └── db-config.ts
│   ├── logger/
│   │   └── winston.config.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .dockerignore
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── .swcrc
├── Dockerfile
├── LICENCE
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

## Docker

To run the nestjs project with docker create a `Dockerfile`:

```Dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy app source code
COPY . .

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "run", "start:prod"]
```

To build the docker image run:

```
docker build -t nestjs-starter-kit .
```

To run the image:

```
docker run -d -p 3000:3000 nestjs-starter-kit
```

If a local mongodb need to be connected to the app use:
```
docker run -p 3000:3000 -e DB_URL=mongodb://host.docker.internal:27017/db_name -d nestjs-starter-kit
```
