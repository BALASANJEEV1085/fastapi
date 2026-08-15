# Full-Stack Secure Authentication System

A containerized full-stack authentication system with a FastAPI backend and a React frontend, orchestrated via Docker Compose. Built to practice production-style JWT auth patterns — registration, login, and password hashing — end to end.

> **Note:** This is a focused auth demo, not a full application. The scope is the auth flow itself (registration, login, token issuance, and password security).

## 🚀 Features
*   **Secure Authentication**: JWT-based login and registration flow.
*   **Password Cryptography**: Passwords are securely hashed using bcrypt prior to database storage.
*   **Relational Database**: SQLAlchemy ORM mapping to an SQLite database.
*   **Containerized Infrastructure**: Fully Dockerized environments (Python backend, Nginx-served React frontend) for seamless deployment.

## 💻 Tech Stack
*   **Backend**: Python, FastAPI, SQLAlchemy, SQLite, passlib, python-jose, python-multipart
*   **Frontend**: JavaScript, React, Vite
*   **Infrastructure**: Docker, Docker Compose, Nginx

## 🛠️ Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

## ⚙️ Getting Started

1. **Clone the repository**
```bash
   git clone https://github.com/aylinasadi/fastapi_auth.git
   cd fastapi_auth
```

2. **Set up environment variables**
   Create a `.env` file in the `backend` directory and add your secure keys:
```bash
   SECRET_KEY="your_secure_random_hex_string"
   ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=30
```
   You can generate a secure key with:
```bash
   openssl rand -hex 32
```

3. **Build and run with Docker**
   Execute the following command in the root directory to build the images and spin up the containers:
```bash
   docker-compose up --build
```

4. **Access the application**
   - Frontend Interface: http://localhost:5173
   - Backend API & Swagger UI: http://localhost:8000/docs
