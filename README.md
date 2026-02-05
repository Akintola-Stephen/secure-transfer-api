# `README.md` — Secure Transfer API

# Secure Transfer API

A **ledger-based wallet transfer service** built with **Node.js, TypeScript, Express, and Sequelize/Postgres**, designed for **financial-grade safety**.

It ensures:

* **Idempotent transfers** to prevent double-spending
* **Ledger-style accounting** (no direct balance mutation)
* **Concurrency-safe transactions**
* **Full auditability**

---

##  Core Concepts

1. **Ledger-based accounting**

   * Every transfer creates immutable ledger entries.
   * Current balances are computed by summing entries.

2. **Idempotency**

   * Every transfer requires a unique **Idempotency Key**.
   * Retrying the same request will **never double-spend**.

3. **Transaction Logging**

   * Every transfer starts with a **PENDING** log entry.
   * Logs are updated to **SUCCESS** or **FAILED** after completion.

---

##  Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file at the project root with your database credentials:

* `DB_NAME` – Postgres database name
* `DB_USER` – Postgres username
* `DB_PASSWORD` – Postgres password
* `DB_HOST` – Host (usually `localhost`)
* `DB_PORT` – Port (usually `5432`)
* `PORT` – API server port

### 3. Set Up Database

Ensure your Postgres database exists. Example:

```bash
createdb secure_transfer_db
```

Run migrations or allow Sequelize to sync tables on server start.

### 4. Run the API

**Development mode (auto-reload)**

```bash
npm run dev
```

**Production mode**

```bash
npm run build
npm start
```

### 5. Run Tests

```bash
npm test
```

Tests cover:

* Idempotency
* Ledger correctness
* Concurrency safety
* Transaction logging

---

## 📝 API Usage

### Endpoint: `POST /api/transfer`

**Purpose:** Transfer money safely between two wallets.

**Headers:**

* `Idempotency-Key`: Unique string per transfer request

**Request Body Example:**

* `fromWalletId`: UUID of sender wallet
* `toWalletId`: UUID of recipient wallet
* `amount`: Amount in cents (smallest currency unit)

**Example (JSON):**

```json
{
  "fromWalletId": "sender-uuid",
  "toWalletId": "recipient-uuid",
  "amount": 1000
}
```

**Response:**

* Success: Transfer processed, ledger entries created
* Failure: Proper error message with reason

---

##  Notes

* **Ledger-first architecture** ensures full audit trail.
* **Idempotency keys** are mandatory for all transfers.
* **Concurrent requests** are safe due to transaction locking.
* **All monetary amounts** are in **smallest currency units** (cents/kobo).

---

##  Workflow

1. Generate or seed wallets in the database.
2. Call `/api/transfer` with a unique idempotency key.
3. Check logs to verify transfer state (PENDING → SUCCESS/FAILED).
4. Sum ledger entries to confirm balances.

---

## Why This Approach

* Prevents **double-spending** even under retries or network failures.
* Fully **auditable and traceable** for compliance.
* Supports **scalable, production-ready** architecture.
