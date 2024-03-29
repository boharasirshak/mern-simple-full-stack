# MERN App

A simple MERN app with JWT authentication.

## Table of Content

1. [Introduction](#introduction)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)

## Introduction

A simple app app with fronend in React and backend in Nodejs with Express. The app uses JWT for authentication and mongodb for database. _It's a MERN stack app with JWT authentication_.

> ### Note

> The expiration time of tokens is kept very short
>
> - Access token: 30 seconds
> - Refresh token: 2 minutes

## Features

1. User registration with Email verification
2. User login with email and password
4. Access token renewal (Silent Authentication)
5. Secure Session Management with Token Expiration
6. Protected Account route with Token authentication

## Requirements

- [Nodejs](https://nodejs.org/en) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [mongodb](https://www.mongodb.com/)

## Installation

1. Clone this repository on your local machine

```bash
git clone https://github.com/boharasirshak/mern-simple-full-stack.git
```

1. Install dependencies by running

```bash
pnpm i -r
```

## Configuration

Before running the application, you need to configure some settings.

### Create a .env file from env.example in the API root folder and set the following environment variables:

```env
DATABASE="Your mongodb connection URL "
ACCESS_TOKEN_SECRET_KEY=' secret key'
REFRESH_TOKEN_SECRET_KEY='secret key'
RESET_PASSWORD_SECRET_KEY='secret key'
CLIENT_BASE_URL="http://localhost:5173"
```

Make sure to replace the key's value with an actual value, You can generate **secret keys** with crypto as follows:

1. run node command

```bash
node
```

1. Now generate a random string with given command

```js
require("crypto").randomBytes(64).toString("hex")
```

#### create .env file from env.example in the **client** root folder with following variables:

```
VITE_API_BASE_URL="http://localhost:3000"
```

## Usage

To start the application, run the following command from the project root:

### - backend

```bash
cd api && pnpm dev
```

### - frontend

```bash
cd client && pnpm dev
```

The backend will be available at http://localhost:3000
Frontend will be available at http://localhost:5173

## API Endpoints

The API provides the following endpoints:

- `POST api/auth/signin`: Singin and get access token and refresh token
- `POST api/auth/signup`: Register new User with email verification
- `GET api/auth/refresh`: refresh(renew) the access token
- `GET api/auth/signout`: signout the User
- `GET api/user`: get the user details
