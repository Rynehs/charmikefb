# Charmike Frontend

A modern React frontend for the Charmike Lending Management System.

The application provides role-based dashboards for Administrators, Agents, and Clients while communicating with the Laravel backend through REST APIs.

---

# Project Status

**Current Version:** v0.2.0

**Current Sprint:** Sprint 2.2 – UI Foundation ✅

**Next Sprint:** Sprint 2.3 – Authentication & Login

---

# Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- React Hook Form
- Zod
- React Query
- React Hot Toast

## UI

- Lucide Icons
- Class Variance Authority (CVA)
- Radix UI Slot
- clsx
- tailwind-merge

---

# Design Language

## Brand Colors

Primary

- Emerald Green (#50C878)

Secondary

- Dark Forest Green (#2E7D32)

Background

- #F5F7F9

Surface

- White

Typography

- Plus Jakarta Sans

Design Philosophy

- Premium institutional lending software
- Minimal visual noise
- Tonal layering instead of visible borders
- Mobile-first
- Responsive
- Modern sans-serif typography

---

# Folder Structure

```text
src/

components/
    ui/
        Badge/
        Button/
        Card/
        Spinner/

pages/
    auth/
    admin/
    agent/
    client/
    dev/

routes/

services/

hooks/

context/

utils/
```

---

# Completed Sprints

## Sprint 1

### Backend

- Laravel backend completed
- Authentication endpoints
- REST API
- Role management
- Loan management endpoints

---

## Sprint 2.1

### Frontend Foundation

Completed

- React
- Vite
- Routing
- Tailwind CSS v4
- Theme configuration
- Utility helpers
- Alias configuration

---

## Sprint 2.2

### UI Foundation

Completed

Reusable Components

- Button
- Card
- Badge
- Spinner

Features

- CVA button variants
- Loading states
- Responsive layout
- Shared component exports
- Component preview page
- Modern reusable architecture

Testing

- Components compile successfully
- No runtime errors
- Preview page operational

---

# Current Progress

| Module | Status |
|----------|--------|
| Backend API | ✅ Complete |
| React Setup | ✅ Complete |
| Routing | ✅ Complete |
| Theme | ✅ Complete |
| UI Foundation | ✅ Complete |
| Authentication | ⏳ Next |
| Admin Dashboard | Planned |
| Agent Dashboard | Planned |
| Client Dashboard | Planned |

---

# Upcoming Sprint

## Sprint 2.3

Authentication

Deliverables

- Premium Login Screen
- Auth Context
- API Integration
- Token Storage
- Role Redirect
- Protected Routes
- Logout
- Session Persistence

---

# Development Workflow

Each sprint follows the same lifecycle.

1. Build
2. Test
3. Review
4. Documentation
5. Git Commit

---

# Environment Variables

Create a `.env` file.

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

# Git Workflow

Feature branches are recommended.

```bash
git checkout -b feature/<feature-name>
```

After completion

```bash
git add .
git commit -m "<commit message>"
```

---

# License

Private Project

Charmike Lending Management System.