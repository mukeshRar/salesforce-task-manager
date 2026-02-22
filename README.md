# Salesforce Task Manager

Full-stack task management app built with:

- React + TypeScript
- Express.js backend
- Salesforce Apex REST
- OAuth 2.0 Authorization Code + PKCE

## Features

- Secure login with Salesforce
- Full CRUD operations
- Token-based authentication
- Production-grade architecture

## Tech Stack

Frontend:
- React
- TypeScript
- TailwindCSS

Backend:
- Node.js
- Express
- Axios

Integration:
- Salesforce External Client App
- Apex REST
- OAuth PKCE flow

## Setup
1. Create .env for backend with
PORT=4000
CLIENT_ID=your_external_client_app_consumer_key
REDIRECT_URI=http://localhost:5173
SF_LOGIN=https://login.salesforce.com

2. Create .env for frontend with
CLIENT_ID=your_external_client_app_consumer_key
REDIRECT_URI=http://localhost:5173

3. Run npm install

### Salesforce
1. Login into your org
2. Create External client credentials app with Oauth + pkce flow
3. Copy client id and paste into .env