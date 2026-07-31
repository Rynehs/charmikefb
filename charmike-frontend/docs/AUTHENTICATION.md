# Authentication

Users authenticate using:

Phone Number

Password

Supported Roles

Administrator

Agent

Client

---

Workflow

User selects role

↓

Enters phone

↓

Enters password

↓

React Login Page

↓

Auth Context

↓

Auth Service

↓

Laravel API

↓

Sanctum Token

↓

Store Session

↓

Redirect to Dashboard

Admin → /admin

Agent → /agent

Client → /client

---

Storage

auth_token

auth_user

Stored in Local Storage

---

Protected Routes

Only authenticated users may access dashboards.

Role validation occurs before rendering each dashboard.