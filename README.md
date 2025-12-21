# HealthSync - Medication & Appointment Adherence System

A production-ready HealthTech application built with the MERN stack (MongoDB, Express, React, Node.js). Designed for patients to manage their medications, appointments, and health logs securely.

## Features

-   **Medication Management**: Track dosages, frequencies, and schedules.
-   **Appointment Tracking**: Manage upcoming doctor visits.
-   **Health Logs**: Record daily vitals and symptoms.
-   **Secure Authentication**: JWT-based auth with Access and Refresh tokens (HttpOnly cookies).
-   **Responsive Dashboard**: Built with React, Tailwind CSS, and ShadCN UI.

## Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, ShadCN UI, Axios.
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose).
-   **Security**: bcryptjs, jsonwebtoken, cookie-parser, strict CORS.

## Setup Instructions

### Prerequisites
-   Node.js (v14+)
-   MongoDB (Local running on port 27017 or Atlas URI)

### Installation

1.  **Clone the repository** (if applicable)
2.  **Install Dependencies**:

    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Variables**:
    ensure `server/.env` exists with:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/healthsync
    JWT_SECRET=supersecretkey_change_me_in_production
    JWT_REFRESH_SECRET=supersecretrefreshkey_change_me
    ```

4.  **Seed Data** (Optional):
    Populate the database with dummy users and records.
    ```bash
    cd server
    node utils/seed.js
    ```
    *Default Login:* `patient@example.com` / `password123`

5.  **Run Application**:

    **Backend**:
    ```bash
    cd server
    npm run dev
    ```
    (Runs on http://localhost:5000)

    **Frontend**:
    ```bash
    cd client
    npm run dev
    ```
    (Runs on http://localhost:5173)

## API Documentation

The API runs at `http://localhost:5000/api`.

### Auth
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Medications
- `GET /medications` - List all
- `POST /medications` - Add new

### Appointments
- `GET /appointments` - List all
- `POST /appointments` - Add new

### Logs
- `GET /logs` - View history
- `POST /logs` - Add entry
