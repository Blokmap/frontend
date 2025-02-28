# Frontend Setup Guide

## **Requirements**

Before you begin, make sure you have the following software installed:

- **Node 20** (check with `node --version`)

## **Project Installation**

Install the dependencies:

```sh
npm install
```

## **Starting the Local Development Server**

The development server configuration is part of the [deploy repository](). Head over there and read the instructions to start the development server.

## **Running the linter and formatter**

We use `eslint` for linting and `prettier` for formatting. You can run these with:

```sh
npm run lint
npm run format
```

## **Running the tests**

We use `vitest` for unit testing and `cypress` for e2e testing. You can run the tests with:

```sh
npm run test:unit
npm run test:e2e
```