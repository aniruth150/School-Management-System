# School Management System

A Full-Stack School Management System built with **React.js** (Tailwind CSS), **Spring Boot** (Java), and **MySQL**. It supports role-based access for Admin, Teacher, and Student users, with JWT authentication, dashboards, attendance and marks management, reporting, and notifications.

---

## 1. Tech Stack

| Layer      | Technology                                              |
|------------|-----------------------------------------------------------|
| Frontend   | React 18, React Router 6, Tailwind CSS, Recharts, Axios   |
| Backend    | Spring Boot 3.2 (Java 17), Spring Security, Spring Data JPA |
| Database   | MySQL 8                                                    |
| Auth       | JWT (JJWT library), BCrypt password hashing                |

---

## 2. Project Structure

```
school-management-system/
├── backend/                     # Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/sms/
│       │   ├── config/          # Security & CORS configuration
│       │   ├── security/        # JWT utilities & filters
│       │   ├── entity/          # JPA entities
│       │   ├── repository/      # Spring Data repositories
│       │   ├── dto/             # Request/response DTOs
│       │   ├── service/         # Business logic
│       │   ├── controller/      # REST controllers
│       │   └── exception/       # Global exception handling
│       └── resources/
│           └── application.properties
├── frontend/                    # React application
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/
│   └── src/
│       ├── api/                 # Axios instance
│       ├── context/             # Auth context (JWT session)
│       ├── services/            # API service modules
│       ├── components/          # Shared UI components
│       └── pages/
│           ├── admin/
│           ├── teacher/
│           └── student/
├── database/
│   └── schema.sql               # MySQL schema + sample data
└── README.md
```

---

## 3. Prerequisites

- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8+** running locally (or accessible remotely)

---

## 4. Database Setup

1. Start your MySQL server.
2. Either let Spring Boot auto-create the schema (`spring.jpa.hibernate.ddl-auto=update` is already set), **or** run the provided script manually:

```bash
mysql -u root -p < database/schema.sql
```

3. Update credentials in `backend/src/main/resources/application.properties` if your MySQL username/password differ from the defaults (`root` / `root`).

> **Note on sample passwords:** The `password` values seeded in `schema.sql` are placeholder BCrypt-formatted strings and are not guaranteed to match a known plaintext password. For real login testing, create accounts using the **Signup** page in the app — this correctly hashes passwords via Spring Security's `BCryptPasswordEncoder`. The seed data is still useful for courses, enrollments, attendance, and marks records tied to those sample users.

---

## 5. Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

### Key configuration (`application.properties`)
- `spring.datasource.url` — MySQL connection string (auto-creates the DB if missing)
- `jwt.secret` / `jwt.expiration` — JWT signing key and token lifetime (ms)
- `spring.jpa.hibernate.ddl-auto=update` — auto-creates/updates tables on startup

---

## 6. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

The app will start on **http://localhost:3000** and proxy API calls to `http://localhost:8080/api` (configurable via `REACT_APP_API_URL` in a `.env` file).

To create a production build:

```bash
npm run build
```

---

## 7. Default Roles & Access

| Role    | Capabilities                                                                 |
|---------|-------------------------------------------------------------------------------|
| ADMIN   | Full dashboard, manage students/teachers/courses, assign teachers, enroll students, view reports |
| TEACHER | View assigned courses, mark attendance, enter/update marks, view students     |
| STUDENT | View profile, attendance %, marks/grades, enrolled courses, notifications     |

Sign up via `/signup` and choose a role (Admin/Teacher/Student). Each role is redirected to its own dashboard after login.

---

## 8. API Overview

All endpoints are prefixed with `/api`. JWT must be sent as `Authorization: Bearer <token>` for protected routes.

### Auth
| Method | Endpoint             | Description          |
|--------|-----------------------|-----------------------|
| POST   | `/auth/signup`         | Register a new user  |
| POST   | `/auth/login`          | Login and receive JWT|

### Admin (`ROLE_ADMIN`)
| Method | Endpoint                                        | Description                  |
|--------|--------------------------------------------------|-------------------------------|
| GET    | `/admin/dashboard/stats`                          | Aggregate dashboard stats     |
| GET/PUT/DELETE | `/admin/students`, `/admin/students/{id}`  | Student CRUD                  |
| GET/PUT/DELETE | `/admin/teachers`, `/admin/teachers/{id}`  | Teacher CRUD                  |
| GET/POST/PUT/DELETE | `/admin/courses`, `/admin/courses/{id}` | Course CRUD                   |
| POST   | `/admin/courses/{courseId}/assign-teacher/{teacherId}` | Assign teacher to course |
| POST   | `/admin/enroll`                                   | Enroll a student in a course  |

### Teacher (`ROLE_TEACHER`)
| Method | Endpoint                                  | Description                |
|--------|--------------------------------------------|-----------------------------|
| GET    | `/teacher/courses`                          | Courses assigned to teacher |
| GET    | `/teacher/courses/{courseId}/students`      | Students in a course        |
| POST   | `/teacher/attendance`                       | Mark attendance             |
| GET    | `/teacher/attendance/course/{courseId}`     | Attendance records          |
| POST   | `/teacher/marks`                            | Enter marks                 |
| PUT    | `/teacher/marks/{id}`                       | Update marks                |
| GET    | `/teacher/marks/course/{courseId}`          | Marks for a course          |

### Student (`ROLE_STUDENT`)
| Method | Endpoint                          | Description             |
|--------|-------------------------------------|---------------------------|
| GET    | `/student/profile`                   | Get own profile           |
| PUT    | `/student/profile`                   | Update own profile        |
| GET    | `/student/courses`                   | Enrolled courses          |
| GET    | `/student/attendance`                | Attendance records        |
| GET    | `/student/attendance/percentage`     | Attendance percentage     |
| GET    | `/student/marks`                     | Marks & grades            |

### Notifications (any authenticated user)
| Method | Endpoint                    | Description                       |
|--------|-------------------------------|-------------------------------------|
| GET    | `/notifications`               | Get notifications (personal + broadcast) |
| POST   | `/notifications`               | Create a notification              |
| PATCH  | `/notifications/{id}/read`     | Mark notification as read          |

---

## 9. Core Features Implemented

- JWT-based authentication with BCrypt password hashing
- Role-based route protection (frontend `ProtectedRoute` + backend `SecurityFilterChain`)
- Full CRUD for Students, Teachers, Courses
- Course-teacher assignment and student enrollment
- Attendance marking with PRESENT / ABSENT / LATE statuses and percentage calculation
- Marks entry with automatic grade calculation (A+ to F)
- Admin dashboard with charts (Recharts: bar & pie charts)
- Reports page with CSV export for marks and attendance
- Notification system (broadcast + user-specific, read/unread state)
- Responsive, sidebar-based dashboard layout (mobile-friendly)
- Client-side search, filter, and pagination in data tables
- Form validation on login/signup/profile forms
- Centralized error handling (`GlobalExceptionHandler` on backend, toast notifications on frontend)

## 10. Notes & Possible Extensions

- PDF export is not wired up out of the box; CSV export is provided in Reports. To add PDF export, a library such as `jspdf` (frontend) or `iText`/`OpenPDF` (backend) can be layered onto the existing report data endpoints.
- Password reset is not implemented as a full email-flow; this would typically require an email service (e.g. Spring Mail) plus a reset-token entity, which can be added as a follow-up module.
- The system assumes one MySQL instance; for production, externalize secrets (`jwt.secret`, DB credentials) via environment variables instead of `application.properties`.
