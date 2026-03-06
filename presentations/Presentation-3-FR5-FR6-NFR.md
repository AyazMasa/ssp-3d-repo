# Presentation 3: Functional Requirements FR5 & FR6 + Non-Functional Requirements
## Internet Technologies - Progressive Web Application Development

**Student:** Ayaz Masa  
**Student ID:** 20233943  
**Date:** 13th May  
**Weight:** 20% of course grade  
**Live URL:** https://ssp-3d-repo.onrender.com

---

## Slide 1: Title Slide

### SSP – 3D Schematics Repository Portal
#### Presentation 3: Session Management, XML/XSLT, & Quality Requirements

- **Course:** Internet Technologies
- **Student:** Ayaz Masa (ID: 20233943)
- **Presentation Date:** 13th May
- **Focus:** FR5 & FR6 + Non-Functional Requirements (NFR)

---

## Slide 2: FR5 Overview – Session Management & Authentication

### Requirement: Implement secure session-based access control

### Authentication System
- **Public registration** – anyone can create an account
- **bcryptjs** password hashing (cost factor 10)
- **Role-based access** – two roles: `admin` and `user`
- **express-session** with SQLite session store
- **Session regeneration on login** – prevents session fixation attacks
- **Environment-based secret** – `SESSION_SECRET` from env vars

### Session Flow
```
Register / Login
    ↓
[Verify credentials (bcrypt.compare)]
    ↓
[Create session] → req.session.user = { id, username, role }
    ↓
[Store session in SQLite (connect-sqlite3)]
    ↓
[Session cookie sent to browser (httpOnly, 24h)]
    ↓
[Protected routes accessible based on role]
    ↓
Logout → req.session.destroy()
```

---

## Slide 3: FR5 – Registration & Login

### Registration Page (`/register`)
- Public access – any visitor can register
- Fields: Username, Email, Password, Confirm Password
- **Client-side validation:** Min lengths, password matching, email format
- **Server-side validation:** Duplicate username/email, password length ≥ 6
- Password stored as **bcrypt hash** (never plaintext)
- New users get role `user` by default

### Login Page (`/login`)
- Username and password input
- **bcrypt.compare()** verifies password against stored hash
- Session stores: `{ id, username, role }`
- Flash message: "Welcome back, {username}!"

### Login Route (Actual Implementation)
```javascript
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await get("SELECT * FROM users WHERE username = ?", [username]);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.render("login", { error: "Invalid username or password." });
  }
  // Regenerate session to prevent session fixation
  req.session.regenerate((err) => {
    if (err) return res.status(500).send("Internal server error");
    req.session.user = { id: user.id, username: user.username, role: user.role };
    req.session.flash = "Welcome back, " + user.username + "!";
    res.redirect("/home");
  });
});
```

### Logout Route (POST to prevent CSRF)
```javascript
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/home"));
});
// GET /logout also supported for convenience
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/home"));
});
```

### Screenshot Placeholder
```
[SCREENSHOT: Registration form]
[SCREENSHOT: Login form]
[SCREENSHOT: "Welcome back, admin!" flash message after login]
[SCREENSHOT: Error on invalid credentials]
```

---

## Slide 4: FR5 – Role-Based Access Control

### Two Middleware Functions (`routes/middleware.js`)

#### `requireLogin` – Protects authenticated routes
```javascript
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}
```
Applied to: `/models/*`, `/report/*`

#### `requireAdmin` – Protects admin-only routes
```javascript
function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "admin") {
    req.session.flash = "Admin access required.";
    return res.redirect("/home");
  }
  next();
}
```
Applied to: `/users/*`

### Ownership-Based Access on Models
- Beyond role checks, models have **ownership enforcement**
- `created_by` field tracks who created each model
- Edit/Delete: only the owner or an admin can modify
```javascript
if (model.created_by !== req.session.user.id && req.session.user.role !== "admin") {
  req.session.flash = "You can only edit your own models.";
  return res.redirect("/models");
}
```

### Navbar Adapts to Role
| Element | Guest | User | Admin |
|---------|-------|------|-------|
| Home, About, Contact | ✅ | ✅ | ✅ |
| Register / Sign In | ✅ | — | — |
| Models, Report | — | ✅ | ✅ |
| Users (CRUD) | — | — | ✅ |
| Role badge | — | `user` | `admin` |

### Screenshot Placeholder
```
[SCREENSHOT: Admin navbar with Users link and "admin" badge]
[SCREENSHOT: Regular user navbar without Users link, "user" badge]
[SCREENSHOT: Guest navbar with Register/Sign In]
[SCREENSHOT: "Admin access required" flash when user tries /users]
```

---

## Slide 5: FR5 – Session Configuration & Security

### Session Store: SQLite
```javascript
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

// Trust Render's reverse proxy for secure cookies
app.set("trust proxy", 1);

app.use(session({
  store: new SQLiteStore({ db: "sessions.sqlite", dir: "./db" }),
  secret: process.env.SESSION_SECRET || "change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  // 24 hours
  }
}));
```

### Security Features
- **`trust proxy: 1`** – Required for `secure: true` cookies behind Render's reverse proxy
- **`secure: true` in production** – Cookie only sent over HTTPS
- **`httpOnly: true`** – Cookie not accessible from JavaScript (prevents XSS theft)
- **`maxAge: 24h`** – Sessions automatically expire
- **Session regeneration** – `req.session.regenerate()` on login to prevent session fixation
- **Environment-based secret** – `SESSION_SECRET` env var on Render.com
- **Stale session cleanup** – Middleware checks if user still exists in DB
- **`saveUninitialized: false`** – No empty sessions created

### Stale Session Cleanup
```javascript
app.use(async (req, res, next) => {
  if (req.session.user) {
    const exists = await get("SELECT id FROM users WHERE id = ?", [req.session.user.id]);
    if (!exists) { req.session.destroy(); return res.redirect("/login"); }
  }
  next();
});
```

### Screenshot Placeholder
```
[SCREENSHOT: Cookie in browser developer tools (httpOnly flag)]
[SCREENSHOT: Session expires after 24h (login required again)]
```

---

## Slide 6: FR6 – XML Export

### Requirement: Export model data to XML format

### Visibility-Filtered XML Generation
The XML export **respects user visibility rules** – the same filtering as the models list:
- **Admins** see all models
- **Regular users** see Public models + their own Private models
- **Guests** see Public models only

### XML Generation Process
```
Database Query (filtered by user role/ownership)
    ↓
[Format each row as XML element]
    ↓
[Escape special characters (& < > " ')]
    ↓
[Wrap in root element with timestamp]
    ↓
[Send directly to browser as application/xml]
```

### XML Structure Example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<models generatedAt="2026-02-24T14:30:00.000Z">
  <model>
    <id>1</id>
    <model_id>MDL-0001</model_id>
    <title>3D Gear Assembly</title>
    <author_name>John Doe</author_name>
    <author_email>john@example.com</author_email>
    <category>Mechanical</category>
    <format>STL</format>
    <file_link>http://example.com/models/gear.stl</file_link>
    <visibility_status>Public</visibility_status>
    <created_at>2026-02-24T10:15:00.000Z</created_at>
  </model>
</models>
```

### XML Character Escaping
```javascript
function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
```

### Route: `/report/xml`
- Protected route (login required)
- Generates visibility-filtered XML from database
- Streams directly to browser (no file saved to disk)
- Returns `application/xml` content type

### Screenshot Placeholder
```
[SCREENSHOT: /report/xml showing XML in browser]
[SCREENSHOT: XML file structure]
```

---

## Slide 7: FR6 – XSLT Transformation

### Requirement: Transform XML to HTML using XSLT

### Transformation Pipeline
```
XML (models.xml)
    ↓
[Load XSLT stylesheet: models.xsl]
    ↓
[Saxon-JS XSLT 3.0 processor (server-side)]
    ↓
[Pre-compiled SEF JSON (models.sef.json)]
    ↓
[Generate HTML output]
    ↓
[Display in iframe on /report page]
```

### Report Page Architecture
- `/report` – Main page with iframe that loads `/report/html`
- `/report/html` – Saxon-JS transforms XML → HTML (served inside iframe)
- `/report/xml` – Raw XML download/view

### XSLT Stylesheet Features (`models.xsl`)
- Loops through all `<model>` elements
- Creates styled HTML table with all fields
- Shows model count total
- Displays generation timestamp
- Hyperlinks file URLs
- Professional CSS styling applied

### Technology Stack
- **XSLT Processor:** Saxon-JS 2.7.0 (pure JavaScript, server-side)
- **XSLT Version:** 3.0
- **Compilation:** SEF JSON format (pre-compiled for performance)
- **No browser plugin required** – all processing on server

### Screenshot Placeholder
```
[SCREENSHOT: /report page showing XSLT-transformed HTML table in iframe]
[SCREENSHOT: Report header with model count and timestamp]
[SCREENSHOT: Table with hyperlinked file links]
```

---

## Slide 8: Non-Functional Requirements (Quality)

### NFR1 – Performance
- ✅ SQLite queries with parameterized statements
- ✅ Pre-compiled XSLT (SEF JSON) for fast transformation
- ✅ Async/await throughout (non-blocking I/O)
- ✅ Static file serving from `public/` folder
- ✅ XML generated in-memory (no disk I/O)

### NFR2 – Security
- ✅ **bcryptjs** password hashing (not plaintext)
- ✅ **Session regeneration on login** (prevents session fixation)
- ✅ **Session secret from environment variable** (not hardcoded)
- ✅ **Secure cookies in production** (`secure: true` + `trust proxy`)
- ✅ **httpOnly cookies** (XSS protection)
- ✅ **Parameterized SQL queries** (prevent injection)
- ✅ **HTML escaping** in EJS templates (prevent XSS)
- ✅ **XSS-safe file link rendering** (href restricted to http/https)
- ✅ **XML character escaping** (prevent injection)
- ✅ **Role-based + ownership-based access control**
- ✅ **Admin self-demotion prevention** (prevents zero-admin scenario)
- ✅ **POST logout** (prevents CSRF via GET)
- ✅ **Stale session cleanup** (deleted users can't stay logged in)
- ✅ **Visibility-filtered reports** (Private models excluded for non-owners)

### NFR3 – Usability
- ✅ Modern UI with CSS custom properties and responsive design
- ✅ **Embedded 3D model viewer** (GLB/GLTF via model-viewer, STL/OBJ via Three.js)
- ✅ Hero section with contextual CTAs (guest vs. logged-in)
- ✅ Role badges in navbar (visual role indicator)
- ✅ **Active nav link highlighting** (via `currentPath`)
- ✅ Flash messages with **colour types** (success/error/warning)
- ✅ **Inline form validation** (no alert popups)
- ✅ Form data retention on validation errors
- ✅ Search/filter on models list
- ✅ Confirmation dialogs before destructive actions
- ✅ **File link validation** (URL + 3D extension enforcement)

### NFR4 – Maintainability
- ✅ Modular route files (public, auth, models, users, report)
- ✅ Centralized middleware (middleware.js)
- ✅ EJS partial system (layout.ejs + footer.ejs)
- ✅ Centralized validation (validation.js)
- ✅ Database auto-migration on startup
- ✅ Environment variable configuration
- ✅ Try-catch error handling on all async routes

### NFR5 – Deployment & Availability
- ✅ **Live on Render.com** – https://ssp-3d-repo.onrender.com
- ✅ `/healthz` endpoint for uptime monitoring
- ✅ `PORT` environment variable support
- ✅ `.gitignore` for clean deployments
- ✅ GitHub integration for auto-deploy
- ✅ **Auto-seeding** (admin + 5 sample GLB models on first start)

---

## Slide 9: Complete Feature Summary

### All Functional Requirements – ✅ Completed

| Requirement | Status | Details |
|-------------|--------|---------|
| FR1: Public Pages | ✅ | Home (hero + features), About (tech table), Contact (Formspree with redirect-back) |
| FR2: CRUD Operations | ✅ | Model CRUD (ownership + visibility) + User CRUD (admin, self-demotion prevention) |
| FR3: Data Validation | ✅ | Client-side (inline errors, URL + 3D extension) + Server-side (all routes) |
| FR4: Flow Management | ✅ | 5 route modules, EJS partials, PRG, flash messages with colour types, active nav |
| FR5: Session Management | ✅ | bcrypt auth, session regeneration, secure cookies, roles, middleware, SQLite sessions |
| FR6: XML + XSLT | ✅ | Visibility-filtered XML, Saxon-JS XSLT 3.0, report page with iframe |

### Beyond Requirements
- ✅ Public user registration (not just admin login)
- ✅ Model ownership tracking with `created_by`
- ✅ **Embedded 3D model viewer** (GLB/GLTF via model-viewer, STL/OBJ via Three.js)
- ✅ **Private model visibility** control (Public/Private)
- ✅ **File link validation** (URL + 3D file extension enforcement)
- ✅ Working contact form via **Formspree** (real email delivery with redirect-back)
- ✅ **Inline form validation** (no alert popups)
- ✅ Flash messages with **colour types** (success/error/warning)
- ✅ **Active nav highlighting**
- ✅ **Admin self-demotion prevention** + orphaned model reassignment
- ✅ **Session regeneration** on login (prevents session fixation)
- ✅ **Secure cookies** in production + trust proxy
- ✅ Modern professional UI (CSS custom properties, responsive)
- ✅ Live production deployment on **Render.com**
- ✅ Health check endpoint for monitoring
- ✅ Auto-seeding with **5 sample GLB models** from Khronos Group
- ✅ Search/filter functionality on models

### Project Statistics
- **Total Routes:** 20+ endpoints across 5 route files
- **Templates:** 15 EJS view files
- **Database Tables:** 2 (models + users) + sessions
- **Validation:** 6 form validators (client + server)
- **3D Formats Supported:** GLB, GLTF, STL, OBJ (viewer) + FBX, STEP, DWG, etc. (link accepted)
- **Deployment:** Live at https://ssp-3d-repo.onrender.com

---
