# Charmike Investments Management System

## Overview

Charmike Investments Management System is a modern lending management platform designed to support multiple business types through configurable business logic.

The system currently supports:

- Secure authentication
- Role-based access control
- Mobile number login
- Responsive UI component library
- Protected routing
- Laravel REST API
- React Frontend

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- React Query
- Axios
- Tailwind CSS
- React Hot Toast

### Backend

- Laravel 12
- Sanctum Authentication
- MySQL

---

## Authentication

Users authenticate using:

- Mobile Number
- Password

Supported roles:

- Administrator
- Agent
- Client

Authentication is handled through dedicated endpoints:

POST /api/admin/login

POST /api/agent/login

POST /api/client/login

---

## Current Status

Sprint 2 Complete

Next Sprint:

Dashboard development.