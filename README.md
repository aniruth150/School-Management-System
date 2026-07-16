# School Management System

A full-stack School Management System with:
- **Backend:** Node.js + Express + MySQL (mysql2)
- **Frontend:** Plain HTML, CSS, JavaScript (no build step needed)
- **Auth:** JWT-based login, password hashing with bcrypt

## Features
- Login page (Admin / Teacher / Student)
- Register page (Student / Teacher sign up)
- Admin Dashboard — view all registered students and teachers, with counts, and ability to remove a user
- Student Dashboard — view own profile
- Teacher Dashboard — view own profile
- Data is stored in **three separate MySQL tables**: `admins`, `teachers`, and `students`

## 1. Requirements
- [Node.js](https://nodejs.org) version 18 or higher. Check with:
  ```
  node -v
  npm -v
  ```
- **MySQL Server** installed and running locally (or accessible remotely).
  - Windows/Mac: install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/), or use XAMPP/WAMP, which bundles MySQL.
  - Mac (Homebrew): `brew install mysql && brew services start mysql`
  - Linux: `sudo apt install mysql-server && sudo systemctl start mysql`

You do **not** need to manually create the database or tables — the app creates
them automatically on first run. You only need MySQL itself installed and running.

## 2. Configure the database connection (`.env`)

This project already includes a `.env` file in the root folder with sensible
local defaults:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management

PORT=3000
JWT_SECRET=school-management-super-secret-key-change-me
```

Open `.env` in VS Code and edit it to match **your** MySQL setup:

- `DB_USER` — your MySQL username (often `root`)
- `DB_PASSWORD` — your MySQL password (leave blank only if your MySQL root
  user truly has no password — many installers set one during setup)
- `DB_HOST` / `DB_PORT` — usually `localhost` / `3306` unless you configured
  MySQL differently
- `DB_NAME` — the database name the app will create automatically
  (`school_management` by default — you can rename it if you like)

If you ever lose this file, copy `.env.example` to `.env` and fill in your
own values:
```
cp .env.example .env
```

## 3. Setup (in VS Code)

1. Unzip this project and open the `school-management-system` folder in VS Code
   (`File > Open Folder...`).
2. Make sure MySQL is running (see step 1).
3. Edit `.env` with your MySQL credentials (see step 2).
4. Open a terminal in VS Code: `Terminal > New Terminal`.
5. Install dependencies:
   ```
   npm install
   ```
6. Start the server:
   ```
   npm start
   ```
7. You should see:
   ```
   School Management System running at: http://localhost:3000
   ```
   On first run, the app automatically creates the `school_management`
   database, the `admins`, `teachers`, and `students` tables, and a default
   admin account.
8. Open your browser at **http://localhost:3000**

## 4. Default Admin Login

An admin account is automatically created the first time the server starts:

- **Email:** admin@school.com
- **Password:** Admin@123

Use this to log in and see the Admin Dashboard listing every student and
teacher who registers.

## 5. How to Use

1. Go to `http://localhost:3000` → click **Register** to create a Student or
   Teacher account.
2. Log back in at the login page with that account → you'll land on the
   Student/Teacher dashboard showing your profile.
3. Log in as **admin** (details above) → you'll land on the Admin Dashboard,
   which lists every student and teacher, with their details, and lets you
   remove accounts.

## 6. Project Structure

```
school-management-system/
├── server.js               # Express app entry point
├── database.js             # MySQL connection pool + table creation + admin seeding
├── package.json
├── .env                     # Your local database credentials (edit this!)
├── .env.example             # Template/reference for .env
├── middleware/
│   └── auth.js               # JWT verification & role-guard middleware
├── routes/
│   ├── auth.js                 # /api/auth/register, /login, /me
│   └── admin.js                 # /api/admin/students, /teachers, /summary, delete
└── public/                  # Frontend (served statically by Express)
    ├── index.html             # Login page
    ├── register.html          # Register page
    ├── admin-dashboard.html   # Admin view of all students & teachers
    ├── student-dashboard.html
    ├── teacher-dashboard.html
    ├── css/style.css
    └── js/
        ├── api.js             # Shared fetch/auth helper
        └── admin.js           # Admin dashboard logic
```

## 7. Troubleshooting

- **`Could not connect to MySQL` on startup**: This means Node couldn't reach
  your MySQL server. Check:
  1. Is MySQL actually running? (`mysql --version` works, but that doesn't
     mean the *server* is running — check via Services on Windows, or
     `brew services list` / `systemctl status mysql` on Mac/Linux.)
  2. Are `DB_USER` / `DB_PASSWORD` in `.env` correct? Try logging in manually
     with `mysql -u root -p` using the same credentials.
  3. Is `DB_PORT` correct? Default MySQL port is `3306`.

- **`Access denied for user 'root'@'localhost'`**: Your `.env` password
  doesn't match your actual MySQL root password. Reset it or use a different
  MySQL user with privileges to create databases.

- **Port 3000 already in use**: Change `PORT` in your `.env` file to
  something else, e.g. `PORT=4000`, then restart with `npm start`.

- **Want to start fresh / wipe all data**: Connect to MySQL and run:
  ```sql
  DROP DATABASE school_management;
  ```
  Then restart the server — it will recreate the database, all three
  tables (`admins`, `teachers`, `students`), and the default admin account
  automatically.

- **Forgot admin password**: Either reset it directly in MySQL:
  ```sql
  UPDATE admins SET password_hash = '<new-bcrypt-hash>' WHERE email = 'admin@school.com';
  ```
  or drop the database (see above) to regenerate the default admin account
  (this clears all other data too, so only do this in development).

- **View your data directly in MySQL**:
  ```sql
  USE school_management;
  SELECT id, name, email FROM students;
  SELECT id, name, email FROM teachers;
  SELECT id, name, email FROM admins;
  ```
