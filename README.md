# Onigiri.Z: Enterprise Blockchain Node 🍙

**Onigiri.Z** is a high-performance, modular blockchain platform built with a **Go** backend and **TypeScript** frontend. It features Proof of Work (PoW) mining, JWT authentication, and a premium enterprise dashboard.

## Key Features
- **Proof of Work (PoW)**: Mining with configurable difficulty (4 leading zeros).
- **JWT Authentication**: Secure register/login with bcrypt password hashing.
- **Transaction Mempool**: Async transaction pooling before block creation.
- **Persistent Storage**: JSON file-based persistence for blockchain and user data.
- **TypeScript Frontend**: Fully typed Vite + TypeScript dashboard with strict interfaces.
- **Docker Support**: Production-ready containerized deployment.

## 🛠️ Getting Started

### Prerequisites
- [Go 1.26+](https://golang.org/dl/)
- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (Optional)

### Run Locally
```bash
# 1. Build the frontend
cd frontend
npm install
npm run build
cd ..

# 2. Build and run the Go server
go build .
./simple-blockchain     # Linux/macOS
./simple-blockchain.exe # Windows
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Development Mode (with hot reload)
```bash
# Terminal 1: Go server
go run .

# Terminal 2: Vite dev server (proxies API to :8080)
cd frontend && npm run dev
```

### Docker
```bash
docker build -t onigiri-z .
docker run -p 8080:8080 onigiri-z
```

## 📡 API

| Endpoint | Method | Auth | Description |
|:---|:---|:---|:---|
| `/api/register` | POST | Public | Create a new user account |
| `/api/login` | POST | Public | Authenticate and receive JWT |
| `/api/blockchain` | GET | Public | View the full blockchain |
| `/api/mempool` | GET | JWT | View pending transactions |
| `/api/transaction` | POST | JWT | Submit a transaction |
| `/api/mine` | POST | JWT | Mine a new block |

## 🏗️ Architecture

```mermaid
flowchart TD
    %% Root
    Root((Onigiri.Z))

    %% Main Branches
    Root --> Backend{Backend}
    Root --> Frontend{Frontend}

    %% Backend Hierarchy
    Backend --> B_Core[Core]
    Backend --> B_API[API]
    Backend --> B_Storage[Storage]

    B_Core --> B_Core1(Consensus PoW)
    B_Core --> B_Core2(Blocks & Transactions)

    B_API --> B_API1(Authentication JWT)
    B_API --> B_API2(Public Routes)
    B_API --> B_API3(Protected Routes)

    B_Storage --> B_Store1[(blockchain.json)]
    B_Storage --> B_Store2[(users.json)]

    %% Frontend Hierarchy
    Frontend --> F_Design[Design]
    Frontend --> F_Modules[Modules]
    Frontend --> F_Ed[Education]

    F_Design --> F_Des1(Enterprise Theme)
    F_Design --> F_Des2(Glassmorphism)

    F_Modules --> F_Mod1(Wallet)
    F_Modules --> F_Mod2(Explorer)
    F_Modules --> F_Mod3(Mining)
    F_Modules --> F_Mod4(Transactions)

    F_Ed --> F_Ed1(Interactive Visualizations)
    F_Ed --> F_Ed2(Tamper Detection)
```
- **Go Backend**: `main.go`, `types.go`, `blockchain.go`, `handlers.go`, `auth_handlers.go`, `users.go`
- **TypeScript Frontend**: `frontend/src/main.ts`, `frontend/src/auth.ts`, `frontend/src/types.ts`
- **Build System**: Vite 5 + TypeScript 5.6
- **Data**: `blockchain.json`, `users.json`

---
© 2026 Onigiri.Z Enterprise
