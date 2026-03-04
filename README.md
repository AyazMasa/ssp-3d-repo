# SSP – 3D Schematics Repository Portal

**Course:** Internet Technologies  
**Project:** Progressive Web Application Development  
**Live URL:** https://ssp-3d-repo.onrender.com

---

## Project Description

A full-stack web application that functions as a centralized repository for 3D models and schematics. The system supports public registration, role-based access (admin/user), full CRUD management for both models and users, real-time contact form submissions via Formspree, and XML/XSLT report generation.

### Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Modern responsive styling with CSS variables |
| JavaScript | Client-side form validation (FR3-A) |
| Node.js + Express | Backend framework, routing, middleware |
| EJS | Server-side template engine |
| SQLite | Relational database |
| bcryptjs | Password hashing |
| express-session | Session management with SQLite store |
| Saxon-JS | XML/XSLT processing |
| Formspree | Contact form email delivery |
| Render.com | Production hosting |

---

## How to Run Locally

### 1. Install Dependencies

```
npm install
```

### 2. Seed the Admin Account

```
npm run seed
```

### 3. Start Development Server

```
npm run dev
```

Server runs at: http://localhost:3000

### 4. (Optional) Start in Production Mode

```
npm start
```

---

## Login Credentials

| Role | Username | Password |
|---|---|---|
| Admin | admin | Admin123! |
| User | *(register at /register)* | *(your choice)* |

**Admin** can manage all models + manage users via `/users`.  
**User** can create models and edit/delete only their own.

---

## Database Setup

The database is **auto-created** when the server starts (`db/database.sqlite`).

Schema is defined in `db/init.sql` and includes:
- `models` table – 3D model records with ownership tracking (`created_by`)
- `users` table – user accounts with hashed passwords and roles

Migrations run automatically (e.g. `created_by` column added on first launch if missing).

---

## Implemented Features

### FR1 – Public Pages
- **Home** (`/home`) – Hero section, feature grid
- **About** (`/about`) – System info, technology table
- **Contact** (`/contact`) – Working form via Formspree (sends real emails)

### FR2 – Model Management (CRUD)
- List models with search (`/models`)
- View model details (`/models/:id`) – includes "Added By" field
- Add new model (`/models/new`) – ownership tracked
- Edit model (`/models/:id/edit`) – owner or admin only
- Delete model (`/models/:id/delete`) – owner or admin only

### FR2 – User Management (CRUD, Admin Only)
- List users (`/users`)
- View user details (`/users/:id`)
- Add new user (`/users/new`)
- Edit user (`/users/:id/edit`)
- Delete user (`/users/:id/delete`)

### FR3 – Data Validation
**Client-side (JavaScript):**
- Required fields, email format, password match/length
- Model ID pattern validation (e.g. `MDL-0001`)
- Separate validators for register, login, model create/edit, user create/edit, contact

**Server-side (Express):**
- Required field checks on every form
- Duplicate username/email/model_id rejection
- Password hashing with bcryptjs
- Error messages with form data retention

### FR4 – Flow Management & Templates
- Express routing with `requireLogin` and `requireAdmin` middleware
- EJS templates with shared layout (`layout.ejs` + `footer.ejs`)
- PRG (Post-Redirect-Get) pattern on all form submissions
- Flash messages for success/error feedback
- Custom 404 page

### FR5 – Session Management
- **Registration** (`/register`) – public sign-up, bcrypt password hashing
- **Login** (`/login`) – database-backed authentication
- **Logout** (`/logout`) – session destruction
- Role-based access: `admin` sees everything, `user` sees own content
- Session stored in SQLite via `connect-sqlite3`
- Environment-based `SESSION_SECRET`

### FR6 – XML + XSLT
- Export all models to XML (`/report/xml`)
- Transform XML → HTML report via XSLT/Saxon-JS (`/report/html`)
- Report page with embedded iframe (`/report`)

### Bonus Features
- **Search** – filter models by ID, title, author, category
- **Ownership** – models track who created them; only owner or admin can edit/delete
- **Formspree** – real email delivery from contact page
- **Health check** – `GET /healthz` endpoint for uptime monitoring
- **Render.com deployment** – live production site

---

## Environment Variables (Production)

| Variable | Purpose |
|---|---|
| `PORT` | Server port (set by Render automatically) |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | Secret for signing session cookies |

---

## Project Structure

```
app.js                    # Express application entry point
package.json              # Dependencies and scripts
.gitignore                # Excludes node_modules, *.sqlite
db/
  db.js                   # Database connection + migrations
  init.sql                # Schema definitions
  seedAdmin.js            # Admin account seeder
routes/
  auth.js                 # Login, register, logout
  middleware.js            # requireLogin, requireAdmin
  models.js               # Model CRUD routes
  public.js               # Home, about, contact
  report.js               # XML export + XSLT report
  users.js                # User CRUD routes (admin)
views/
  layout.ejs              # Header + nav (shared)
  footer.ejs              # Footer (shared)
  home.ejs / about.ejs / contact.ejs / login.ejs / register.ejs
  404.ejs                 # Custom 404 page
  report.ejs              # Report with iframe
  models/
    index.ejs / new.ejs / view.ejs / edit.ejs
  users/
    index.ejs / new.ejs / show.ejs / edit.ejs
public/
  css/style.css           # Full stylesheet
  js/validation.js        # Client-side validation
xml/
  models.xsl              # XSLT stylesheet
  models.sef.json         # Pre-compiled XSLT
presentations/
  Presentation-1-FR1-FR2.md
  Presentation-2-FR3-FR4.md
  Presentation-3-FR5-FR6-NFR.md
```

---

## Render.com Deployment

| Setting | Value |
|---|---|
| Build command | `npm install && node db/seedAdmin.js` |
| Start command | `npm start` |
| Health check path | `/healthz` |