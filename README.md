# SSP – 3D Schematics Repository Portal

**Course:** Internet Technologies  
**Project:** Progressive Web Application Development  
**Live URL:** https://ssp-3d-repo.onrender.com

---

## Project Description

A full-stack web application that functions as a centralized repository for 3D models and schematics. The system supports public registration, role-based access (admin/user), full CRUD management for both models and users, an embedded 3D model viewer, real-time contact form submissions via Formspree, and XML/XSLT report generation.

### Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Modern responsive styling with CSS variables |
| JavaScript | Client-side form validation with inline error messages |
| Node.js + Express | Backend framework, routing, middleware |
| EJS | Server-side template engine |
| SQLite | Relational database |
| bcryptjs | Password hashing |
| express-session | Session management with SQLite store |
| Saxon-JS | XML/XSLT processing |
| Formspree | Contact form email delivery |
| Google model-viewer | 3D GLB/GLTF model viewer |
| Three.js | 3D STL/OBJ model viewer |
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

**Auto-seeding:** On every startup, if the database is empty, the server automatically seeds the admin account and 5 sample models (`db/seedData.js`). This ensures the site always has content, even after Render.com's ephemeral filesystem wipes the database on sleep/restart.

---

## Implemented Features

### FR1 – Public Pages
- **Home** (`/home`) – Hero section, feature grid
- **About** (`/about`) – System info, technology table
- **Contact** (`/contact`) – Working form via Formspree (sends real emails, redirects back with success message)

### FR2 – Model Management (CRUD)
- List models with search (`/models`)
- View model details (`/models/:id`) – includes "Added By" field and **embedded 3D model viewer**
- Add new model (`/models/new`) – ownership tracked
- Edit model (`/models/:id/edit`) – owner or admin only
- Delete model (`/models/:id/delete`) – owner or admin only
- **3D Viewer** – GLB/GLTF models render via Google model-viewer; STL/OBJ via Three.js
- **Visibility** – Private models hidden from other users; only visible to owner and admin

### FR2 – User Management (CRUD, Admin Only)
- List users (`/users`)
- View user details (`/users/:id`)
- Add new user (`/users/new`)
- Edit user (`/users/:id/edit`)
- Delete user (`/users/:id/delete`)

### FR3 – Data Validation
**Client-side (JavaScript):**
- Inline error messages (no alert popups)
- Required fields, email format, password match/length
- Model ID pattern validation (e.g. `MDL-0001`)
- **File link validation** – must be a valid URL pointing to a 3D file (.glb, .stl, .obj, .fbx, .step, .dwg, etc.)
- Separate validators for register, login, model create/edit, user create/edit, contact

**Server-side (Express):**
- Required field checks on every form
- Duplicate username/email/model_id rejection
- URL validation and 3D file extension enforcement on file links
- Model ID pattern validation (2-5 letters, dash, 3-5 digits)
- Visibility status whitelist (Public / Private only)
- Password hashing with bcryptjs
- Error messages with form data retention (passwords excluded)

### FR4 – Flow Management & Templates
- Express routing with `requireLogin` and `requireAdmin` middleware
- EJS templates with shared layout (`layout.ejs` + `footer.ejs`)
- PRG (Post-Redirect-Get) pattern on all form submissions
- Flash messages with success/error/warning types (color-coded)
- Active nav link highlighting
- Custom 404 page

### FR5 – Session Management
- **Registration** (`/register`) – public sign-up, bcrypt password hashing
- **Login** (`/login`) – database-backed authentication with **session regeneration** (prevents session fixation)
- **Logout** (`/logout`) – session destruction (supports POST)
- Role-based access: `admin` sees everything, `user` sees own content
- Session stored in SQLite via `connect-sqlite3`
- Environment-based `SESSION_SECRET`
- Secure cookies enabled in production (with trust proxy for Render.com)

### FR6 – XML + XSLT
- Export models to XML (`/report/xml`) – **visibility-filtered** (respects Private model access)
- Transform XML → HTML report via XSLT/Saxon-JS (`/report/html`)
- Report page with embedded iframe (`/report`)

### Additional Features
- **3D Model Viewer** – GLB/GLTF via Google model-viewer, STL/OBJ via Three.js
- **Search** – filter models by ID, title, author, category
- **Ownership** – models track who created them; only owner or admin can edit/delete
- **Private models** – visibility filtering on list, detail, and report pages
- **Formspree** – real email delivery from contact page (with redirect-back success message)
- **File link security** – XSS-safe href rendering, URL + 3D extension validation
- **Admin protections** – cannot self-demote; orphaned models reassigned on user deletion
- **Health check** – `GET /healthz` endpoint for uptime monitoring
- **Auto-seeding** – admin + 5 sample models seeded on empty database
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
  seedAdmin.js            # Admin account seeder (manual)
  seedData.js             # Auto-seed admin + sample models on startup
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
  js/validation.js        # Client-side validation (inline errors)
  js/viewer3d.js          # Three.js STL/OBJ 3D renderer
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
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/healthz` |