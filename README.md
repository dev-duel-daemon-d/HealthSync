# HealthSync

**HealthSync** is a comprehensive, production-grade **HealthTech platform** designed to bridge the gap between patients and healthcare providers. Built on the **MERN Stack** (MongoDB, Express.js, React, Node.js), it empowers patients to take control of their health through medication tracking, vital logging, and seamless communication with doctors, while providing healthcare professionals with tools to monitor and manage their patients effectively.

---

##  Key Features

### -> For Patients

- **Find & Connect with Specialists**: A searchable directory of doctors. Send connection requests with personalized notes to share your health data securely.
- **Medication Management**: detailed tracking of prescriptions, dosages, and frequencies. Receive updates when your doctor changes your regimen.
- **Health Logging**: Record daily vitals (Blood Pressure, Heart Rate), mood, and symptoms.
- **Appointment Management**: View upcoming appointments and status (Confirmed/Pending).
- **Education Hub**: Access curated health articles and guides.
- **Secure Profile**: Manage personal details and change passwords securely.

### -> For Doctors

- **Patient Management**: View a list of connected patients and access their comprehensive health history.
- **Connection Requests**: Accept or reject incoming requests from new patients.
- **Digital Prescriptions**: Prescribe medications directly to a patient's account.
- **Appointment Dashboard**: Manage your schedule, confirm requests, and set appointment statuses.
- **Vitals Monitoring**: Visualize patient health trends with interactive charts.

---

## -> Technology Stack

### Frontend

- **Framework**: [React 19](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/) (Radix UI + Lucide Icons)
- **State Management**: React Context API
- **Routing**: React Router v7
- **HTTP Client**: Axios (with Interceptors for JWT handling)
- **Data Visualization**: Recharts

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Authentication**:
  - **JWT (JSON Web Tokens)**: Short-lived Access Tokens.
  - **HttpOnly Cookies**: Secure storage for Long-lived Refresh Tokens.
  - **Bcrypt.js**: Password hashing.
- **Real-time**: Socket.io (ready for chat/signaling integration).

---

## 📂 Project Structure

```bash
HealthSync/
├── client/                     # React Frontend
│   ├── public/                 # Static assets (favicon, svg)
│   ├── src/
│   │   ├── assets/             # Images and global styles
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # ShadCN UI primitives (Button, Card, Dialog, etc.)
│   │   │   ├── DoctorDirectory.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ...
│   │   ├── context/            # Global state (AuthContext.jsx)
│   │   ├── lib/                # Utilities (utils.js)
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── Education.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── services/           # API integration (api.js with interceptors)
│   │   ├── App.jsx             # Main Router configuration
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.cjs
│
└── server/                     # Node.js Backend
    ├── controllers/            # Business logic (auth, patient, doctor controllers)
    ├── middleware/             # Custom middleware (authMiddleware.js)
    ├── models/                 # Mongoose Schemas (User, Appointment, ConnectionRequest...)
    ├── routes/                 # API Routes definitions
    ├── utils/                  # Helper scripts (seed.js)
    ├── server.js               # Express app entry point
    └── package.json
```

---

## -> Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance running on port 27017 or Atlas Connection String)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/dev-duel-daemon-d/HealthSync.git
    cd HealthSync
    ```

2.  **Install Dependencies**

    ```bash
    # Install Server Dependencies
    cd server
    npm install

    # Install Client Dependencies
    cd ../client
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the `server` directory:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/healthsync
    JWT_SECRET=your_super_secure_access_secret
    JWT_REFRESH_SECRET=your_super_secure_refresh_secret
    CLIENT_URL=http://localhost:5173
    NODE_ENV=development
    ```

    _(Optional)_ Create a `.env` file in the `client` directory:

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Seed the Database (Optional)**
    Populate the DB with dummy data (Patients, Doctors, Logs):

    ```bash
    cd server
    node utils/seed.js
    ```

    - **Patient Login**: `patient@example.com` / `password123`
    - **Doctor Login**: `doctor@example.com` / `password123`

### Running the App

1.  **Start the Backend**

    ```bash
    cd server
    npm run dev
    ```

    _Server runs on: `http://localhost:5000`_

2.  **Start the Frontend**
    ```bash
    cd client
    npm run dev
    ```
    _Client runs on: `http://localhost:5173`_

---

## => API Documentation

The API is prefixed with `/api`. Protected routes require a valid Bearer Token in the Authorization header.

### Authentication

| Method | Endpoint         | Description                                              |
| :----- | :--------------- | :------------------------------------------------------- |
| `POST` | `/auth/register` | Register a new Patient or Doctor                         |
| `POST` | `/auth/login`    | Login and receive Access Token (Refresh Token in Cookie) |
| `POST` | `/auth/refresh`  | Get a new Access Token using the Refresh Cookie          |
| `GET`  | `/auth/me`       | Get current user details                                 |
| `PUT`  | `/auth/profile`  | Update profile information                               |

### Patient Operations

| Method   | Endpoint                      | Description                           |
| :------- | :---------------------------- | :------------------------------------ |
| `GET`    | `/patient/doctors`            | Search for available doctors          |
| `POST`   | `/patient/request-connection` | Send a connection request to a doctor |
| `GET`    | `/patient/requests`           | View sent connection requests         |
| `DELETE` | `/patient/requests/:id`       | Cancel a pending request              |
| `POST`   | `/patient/logs`               | Create a new health log entry         |

### Doctor Operations

| Method  | Endpoint                          | Description                       |
| :------ | :-------------------------------- | :-------------------------------- |
| `GET`   | `/doctor/patients`                | List all connected patients       |
| `GET`   | `/doctor/requests`                | View incoming connection requests |
| `PUT`   | `/doctor/requests/:id`            | Accept or Reject a request        |
| `POST`  | `/doctor/prescribe`               | Prescribe medication to a patient |
| `PATCH` | `/doctor/appointments/:id/status` | Confirm or Cancel an appointment  |

---

##  Security Best Practices

- **HttpOnly Cookies**: Refresh tokens are stored in HttpOnly, SameSite=Strict cookies to prevent XSS attacks.
- **Password Hashing**: User passwords are encrypted using bcryptjs before storage.
- **Protected Routes**: Middleware verifies valid JWTs for all private endpoints.
- **Role-Based Access Control (RBAC)**: Distinct routes and permissions for Doctors and Patients.

---

##  Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

