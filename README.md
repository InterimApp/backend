# Backend

Minimal Node.js backend for InterimApp.

## Prerequisites

- Node.js (recommended v18+)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root with your environment variables (Firestore/MySQL credentials).

## Run
Start the app with:

```bash
node App.js
```

Or use `npm start` if configured in `package.json`.

## Project structure

- App.js
- config/
	- firestore.js
	- mySql.js
	- swagger.js
- src/
	- controllers/
	- queries/
	- routes/
	- services/

## API docs

Swagger is configured under `config/swagger.js`. If enabled, visit `/api-docs` in your running app.

## Notes

- Keep secrets out of source control; `.env` is ignored via `.gitignore`.
- Update `config/*` with your database credentials.
