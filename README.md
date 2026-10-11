# LeadFlow CRM

A full-stack lead management application for organizing prospects, tracking sales pipeline stages, and managing lead records through a responsive dashboard.

**Repository:** https://github.com/kamalan2k4/leadflow-crm

## Features

- **Authentication:** user registration and login with JWT-based authentication.
- **Lead management:** create, view, edit, and delete leads.
- **Pipeline tracking:** organize leads by status: New, Contacted, Qualified, Proposal, Won, and Lost.
- **Search and filtering:** find leads and filter the list by status.
- **Pagination:** browse lead records in manageable pages.
- **Dashboard statistics:** view pipeline totals for the authenticated account.
- **Data isolation:** lead operations are scoped to the authenticated user.
- **Validated API requests:** server-side request validation and consistent API handling.
- **Responsive interface:** React and TypeScript frontend for desktop and smaller screens.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, CSS, Lucide React |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Validation | Zod |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Development and testing | npm, tsx, Node.js test runner |
| Version control | Git, GitHub |

## Project structure

```text
leadflow-crm/
├── client/
│   ├── src/
│   │   ├── components/        # Shared UI: Modal, BrandMark, AppLoading
│   │   ├── config/            # Environment-derived settings
│   │   ├── features/
│   │   │   ├── auth/          # Session + sign-in form (api, hooks, components)
│   │   │   ├── leads/         # Pipeline data, lead editor, table (api, hooks, components)
│   │   │   └── workspace/     # Sidebar, topbar, menus, utility dialogs
│   │   ├── lib/               # API client and token storage
│   │   ├── pages/             # DashboardPage
│   │   ├── styles/            # Ordered CSS partials, entry point index.css
│   │   ├── utils/             # Formatting and error helpers
│   │   ├── App.tsx            # Composition root and auth gate
│   │   └── main.tsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/            # Environment, database, JWT, CORS
│   │   ├── constants/         # Lead statuses and sources
│   │   ├── controllers/       # HTTP handlers
│   │   ├── errors/            # AppError, ValidationError
│   │   ├── middleware/        # authenticate, notFound, errorHandler
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # Route tables, mounted under /api
│   │   ├── services/          # Business logic and database access
│   │   ├── tests/
│   │   ├── types/             # Express request augmentation
│   │   ├── utils/             # Tokens, validation, request helpers
│   │   ├── validators/        # Zod request schemas
│   │   ├── app.ts
│   │   └── index.ts
│   └── package.json
├── .gitignore
└── README.md
```

The client communicates with the Express API through the API helper in `client/src/lib/api.ts`. The server validates requests, authenticates protected routes, and persists user and lead records through Mongoose.

## Run locally

### Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) (an active LTS release recommended)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- A MongoDB database, either [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/kamalan2k4/leadflow-crm.git
cd leadflow-crm
```

### 2. Configure the backend

Install the server dependencies:

```bash
cd server
npm install
```

Create a file named `.env` inside the `server` directory:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database-name>
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
PORT=5001
CLIENT_URL=http://localhost:5173
```

Replace the MongoDB URI placeholders with the connection string for your own database. Set `JWT_SECRET` to a random value of at least 32 characters; the server refuses to issue or verify tokens with a shorter secret. `CLIENT_URL` is the frontend origin allowed by CORS and defaults to `http://localhost:5173` when omitted. For MongoDB Atlas, create a database user and allow your development machine to connect through the project's Network Access settings.

Keep this file private. Do not commit database credentials or JWT secrets to source control.

Start the backend from the `server` directory:

```bash
npm run dev
```

Keep this terminal open. The API should start on port `5001` when that port is configured and available.

### 3. Configure the frontend

Open a second terminal at the repository root, then install the client dependencies:

```bash
cd client
npm install
```

Create `client/.env.local` with the backend API URL:

```dotenv
VITE_API_URL=http://localhost:5001/api
```

If the backend is running on a different port, update the URL to match it. Restart the Vite development server after changing this file.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. Use the application

1. Register a new account or sign in.
2. Create leads with different names, companies, sources, and statuses.
3. Search for leads and use the status filter and pagination.
4. Open a lead to edit its details, or delete a test record.
5. Review the dashboard totals and confirm that records are associated with the signed-in account.

The application uses the MongoDB database configured for the backend. A fresh database will initially contain no leads.

## Build and test

Run the backend build and test suite from the `server` directory:

```bash
npm run build
npm test
```

Run the frontend production build from the `client` directory:

```bash
npm run build
```

A successful build confirms that the relevant project compiles. The manual workflow above is useful for checking end-to-end behavior in the browser as well.

## API overview

The API base path is `/api`. Protected endpoints require a bearer token in the request header:

```http
Authorization: Bearer <JWT>
```

### Health

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | No | Check API availability |

### Authentication

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a user |
| `POST` | `/api/auth/login` | No | Authenticate and receive a token |
| `GET` | `/api/auth/me` | Yes | Retrieve the current authenticated user |

### Leads

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/api/leads` | Yes | List the authenticated user's leads; supports search, status filtering, and pagination |
| `GET` | `/api/leads/stats` | Yes | Retrieve pipeline totals for the authenticated user |
| `POST` | `/api/leads` | Yes | Create a lead |
| `GET` | `/api/leads/:id` | Yes | Retrieve an owned lead |
| `PATCH` | `/api/leads/:id` | Yes | Update an owned lead |
| `DELETE` | `/api/leads/:id` | Yes | Delete an owned lead |

List requests support query parameters such as `page`, `limit`, `q`, and `status`. Request bodies and exact validation rules are defined by the schemas in `server/src/validators`.

Example request to list leads:

```bash
curl "http://localhost:5001/api/leads?page=1&limit=10" \
  -H "Authorization: Bearer <JWT>"
```

Example request for pipeline statistics:

```bash
curl "http://localhost:5001/api/leads/stats" \
  -H "Authorization: Bearer <JWT>"
```

Register or log in through the application to obtain a token. Replace `<JWT>` with that token when testing protected endpoints.

## Data model

A lead includes the following information:

- `owner`: the user who owns the lead
- `name`: lead name
- `email`, `phone`, and `company`: contact and company details
- `source`: acquisition source
- `status`: current pipeline stage
- `notes`: optional context or follow-up notes
- `createdAt` and `updatedAt`: timestamps

Supported pipeline statuses are `New`, `Contacted`, `Qualified`, `Proposal`, `Won`, and `Lost`.

Supported lead sources are `Website`, `Referral`, `LinkedIn`, `Cold Call`, and `Other`.

The server applies owner-scoped access to lead operations so one account cannot use the API to access another account's leads.

## AI development experience (Code0)

**Code0 usage confirmation:** Code0 was used to build this project.

Code0 was used as an AI-assisted development environment during the project workflow. It supported implementation and refinement while the source code, local execution, and build/test results remained part of the development and review process.

### Specific tasks where Code0 helped

1. **Frontend development:** shaping React and TypeScript dashboard components, forms, and interface states.
2. **REST API implementation:** developing and refining Express authentication and lead-management routes.
3. **Database integration:** working with Mongoose models and user-scoped lead queries.
4. **Debugging:** investigating TypeScript, API connectivity, and local environment configuration issues.
5. **Validation and refinement:** reviewing build/test output and improving dashboard data refresh and presentation behavior.

Git and GitHub were used for source control, with changes organized into commits and pushed to the public repository.

## Security notes

- Passwords are hashed on the server.
- MongoDB credentials and JWT signing secrets belong in the backend environment file.
- Never expose backend secrets through variables prefixed with `VITE_`; client-side variables are included in browser-delivered code.
- Keep `.env` and other files containing credentials out of Git.
- Use a dedicated database user with limited privileges for development.
- Do not use real customer data when testing a public or shared instance.

## Troubleshooting

**The frontend cannot reach the API**
- Confirm that the backend is running.
- Check that `VITE_API_URL` contains the correct host, port, and `/api` path.
- Restart Vite after changing `client/.env.local`.
- Check the browser console and the backend terminal for errors.

**MongoDB connection fails**
- Check the connection string and database credentials.
- Confirm that your MongoDB Atlas network settings allow the connection, or that the local MongoDB service is running.
- Ensure the environment variable names in `server/.env` match the server configuration.

**A lead is not visible**
- Confirm that you are signed in to the account that owns it.
- Clear the search and status filters and check the current page.
- Check the API response in the browser's Network panel.

**The backend port is already in use**
- Configure the server to use an available port and update `VITE_API_URL` to use the same port.

## Potential future improvements

Possible next steps include expanded integration tests, continuous integration, rate limiting, audit logging, lead activity history, CSV import/export, and a deployed demo environment.
