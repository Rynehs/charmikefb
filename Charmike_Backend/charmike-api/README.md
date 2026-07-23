# Charmike Investments — Loan Management API

Laravel 12 · PostgreSQL (Supabase) · Laravel Sanctum

---

## Requirements

| Tool       | Version  |
|------------|----------|
| PHP        | ≥ 8.3    |
| Composer   | ≥ 2.x    |
| PostgreSQL | ≥ 15 (via Supabase) |

---

## Installation

### 1. Clone / copy the project

```bash
git clone <your-repo> charmike-loan-api
cd charmike-loan-api
```

### 2. Install dependencies

```bash
composer install
```

### 3. Create environment file

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure Supabase PostgreSQL

Open `.env` and update:

```env
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxxxxxxxxx.supabase.co   # From Supabase → Settings → Database
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-db-password
```

> **Tip:** Get your connection string from  
> Supabase Dashboard → Your Project → Settings → Database → Connection string → URI

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Seed sample data

```bash
php artisan db:seed
```

This creates:
- **Admin** — phone: `0700000000` / password: `password123`
- **Agents** — AG001 (`0711000001`), AG002 (`0711000002`), AG003 (`0711000003`)
- **Clients** — phones `0722000001` through `0722000004`
- Sample loans in various states (active, completed, pending, rejected)

### 7. Start the server

```bash
php artisan serve
```

API is now live at `http://localhost:8000/api`

---

## Postman Testing

1. Open Postman → **Import** → select `postman/Charmike_Loan_API.postman_collection.json`
2. The collection has a `base_url` variable set to `http://localhost:8000/api` — change if needed
3. **Login first** — the login requests auto-capture the token into `{{token}}`

### Recommended test flow

```
1.  Admin Login              → captures {{token}}
2.  Create Agent             → captures {{agent_id}}
3.  (Register a new Client using the agent code)
4.  Client Login             → captures {{token}}
5.  Apply for Loan           → captures {{loan_application_id}}
6.  Admin Login              → captures {{token}}
7.  List Pending Applications
8.  Approve Loan             → captures {{loan_id}}
9.  Disburse Loan
10. Record Payment
11. Admin Dashboard          → see updated stats
```

---

## API Reference

### Base URL
```
http://localhost:8000/api
```

### Authentication
All protected routes require:
```
Authorization: Bearer <token>
Accept: application/json
```

### Roles & Access

| Endpoint prefix    | Required role |
|--------------------|---------------|
| `/admin/*`         | admin         |
| `/agent/*`         | agent         |
| `/client/*`        | client        |
| `POST /payments`   | admin, agent  |
| `GET /payments`    | admin, agent, client |

---

### Auth Endpoints

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/admin/login`        | Admin login            |
| POST   | `/agent/login`        | Agent login            |
| POST   | `/client/register`    | Client registration    |
| POST   | `/client/login`       | Client login           |
| POST   | `/logout`             | Revoke current token   |

**Client register body:**
```json
{
  "full_name": "Jane Doe",
  "phone": "0712345678",
  "email": "jane@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "national_id": "12345678",
  "agent_code": "AG001"
}
```

---

### Admin Endpoints

**Agents**

| Method | Endpoint                           | Description        |
|--------|------------------------------------|--------------------|
| GET    | `/admin/agents`                    | List all agents    |
| POST   | `/admin/agents`                    | Create agent       |
| GET    | `/admin/agents/{id}`               | Get agent          |
| PUT    | `/admin/agents/{id}`               | Update agent       |
| PATCH  | `/admin/agents/{id}/activate`      | Activate agent     |
| PATCH  | `/admin/agents/{id}/deactivate`    | Deactivate agent   |
| DELETE | `/admin/agents/{id}`               | Delete agent       |

**Clients**

| Method | Endpoint               | Description     |
|--------|------------------------|-----------------|
| GET    | `/admin/clients`       | List all clients |
| GET    | `/admin/clients/{id}`  | Get client       |

**Loans**

| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| GET    | `/admin/loans`                   | All loans (filter by status) |
| GET    | `/admin/loans/pending`           | Pending applications     |
| GET    | `/admin/loans/{id}`              | Loan detail              |
| POST   | `/admin/loans/{id}/approve`      | Approve application      |
| POST   | `/admin/loans/{id}/reject`       | Reject application       |
| POST   | `/admin/loans/{id}/disburse`     | Disburse approved loan   |

**Approve body:**
```json
{ "interest_rate": 20 }
```
System auto-calculates `interest_amount`, `total_due`, `balance`, `due_date`.

**Disburse body:**
```json
{ "reference": "MPESA123456" }
```

**Reports**

| Method | Endpoint                        | Description          |
|--------|---------------------------------|----------------------|
| GET    | `/admin/reports/dashboard`      | Business dashboard   |
| GET    | `/admin/reports/commissions`    | All commissions      |
| GET    | `/admin/settings`               | System settings      |
| PUT    | `/admin/settings`               | Update settings      |

---

### Agent Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | `/agent/dashboard`     | Agent performance stats  |
| GET    | `/agent/clients`       | My clients               |
| GET    | `/agent/clients/{id}`  | Client detail            |
| GET    | `/agent/loans`         | My portfolio loans       |
| GET    | `/agent/loans/{id}`    | Loan detail              |
| GET    | `/agent/commissions`   | My commissions           |

---

### Client Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/client/profile`         | My profile               |
| PUT    | `/client/profile`         | Update profile           |
| POST   | `/client/loans`           | Apply for loan           |
| GET    | `/client/loans`           | My loan applications     |
| GET    | `/client/loans/active`    | Active loans             |
| GET    | `/client/loans/{id}`      | Loan detail + repayments |

---

### Payment Endpoints

| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| POST   | `/payments`   | Record a payment      |
| GET    | `/payments`   | List payments         |

**Record payment body:**
```json
{
  "loan_id": "uuid-of-loan",
  "amount": 2000,
  "reference": "MPESA987654",
  "notes": "Monthly instalment"
}
```

The system automatically:
- Updates `amount_paid` and `balance`
- Marks loan as `completed` when balance reaches zero

---

## Business Rules

- A client **cannot** apply for a loan if they have an active/approved unpaid loan
- Agent codes are auto-generated (AG001, AG002…)
- Clients can only register under an **active** agent
- Commissions are auto-created on loan approval at the configured rate
- Payments can only be made on `active` loans
- Only admins can approve, reject, and disburse loans

---

## System Settings (configurable via API)

| Key                    | Default | Description                        |
|------------------------|---------|------------------------------------|
| `commission_rate`      | `2`     | Agent commission % on principal    |
| `default_interest_rate`| `20`    | Default loan interest rate %       |
| `max_active_loans`     | `1`     | Max concurrent active loans/client |

---

## M-Pesa Integration (Future)

The `LoanService::recordPayment()` method is designed for easy M-Pesa integration:

```php
// In your MpesaCallbackController:
$payment = $this->loanService->recordPayment(
    loan: $loan,
    amount: $mpesaAmount,
    recordedBy: $systemUserId,
    reference: $mpesaTransactionId   // e.g. "RGX3200ABC"
);
```

Simply create a `MpesaCallbackController`, validate the STK Push callback, find the loan, and call `recordPayment()` with the M-Pesa transaction reference.

---

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── AgentController.php
│   │   │   ├── ClientController.php
│   │   │   ├── LoanController.php
│   │   │   └── ReportController.php
│   │   ├── Agent/
│   │   │   ├── ClientController.php
│   │   │   └── LoanController.php
│   │   ├── Client/
│   │   │   ├── LoanController.php
│   │   │   └── ProfileController.php
│   │   ├── ApiController.php
│   │   ├── AuthController.php
│   │   └── PaymentController.php
│   ├── Middleware/
│   │   └── RoleMiddleware.php
│   ├── Requests/
│   │   ├── Admin/ (6 form requests)
│   │   ├── Client/ (3 form requests)
│   │   ├── LoginRequest.php
│   │   └── RecordPaymentRequest.php
│   └── Resources/ (7 API resources)
├── Models/ (8 Eloquent models)
└── Services/
    ├── AuthService.php
    ├── AgentService.php
    ├── LoanService.php
    └── ReportService.php
database/
├── migrations/ (8 migrations)
└── seeders/ (5 seeders)
routes/
└── api.php
postman/
└── Charmike_Loan_API.postman_collection.json
```
