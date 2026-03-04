# Presentation 2: Functional Requirements FR3 & FR4
## Internet Technologies - Progressive Web Application Development

**Student:** Ayaz Masa  
**Student ID:** 20233943  
**Date:** 8th April  
**Weight:** 10% of course grade  
**Live URL:** https://ssp-3d-repo.onrender.com

---

## Slide 1: Title Slide

### SSP – 3D Schematics Repository Portal
#### Presentation 2: Data Validation & Flow Management

- **Course:** Internet Technologies
- **Student:** Ayaz Masa (ID: 20233943)
- **Presentation Date:** 8th April
- **Focus:** Functional Requirements FR3 & FR4

---

## Slide 2: FR3 Overview – Data Validation

### Requirement: Implement client-side and server-side validation

### Why Both Layers?
- **Client-side:** Immediate user feedback, better UX, fewer server round-trips
- **Server-side:** Security, data integrity (cannot be bypassed by disabling JS)

### Validation Strategy
```
User Input
    ↓
[Client-side JS checks (validation.js)]
    ↓ Pass
[Send to server]
    ↓
[Server-side checks (route handler)]
    ↓ Pass
[Store in database]
```

### Forms That Have Validation
1. **Login** form – username/password required
2. **Register** form – username, email, password, confirm password
3. **Model Create/Edit** – Model ID pattern, all fields, email
4. **Contact** form – name, email, subject, message
5. **User Create/Edit** (admin) – username, email, role, password

---

## Slide 3: FR3 – Client-Side Validation (`public/js/validation.js`)

### Dedicated Validation Script

All client-side validation is centralized in `public/js/validation.js`, which attaches to forms by their `action` attribute on page load.

#### Login Form Validation
```javascript
if (action === "/login") {
  if (!fd.get("username") || !fd.get("password")) {
    alert("Please enter username and password.");
    return; // prevents submission
  }
}
```

#### Register Form Validation
- Username: minimum 3 characters
- Email: regex pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Password: minimum 6 characters
- Confirm password: must match password field

#### Model Form Validation
- Model ID: must match pattern `MDL-XXXX` (e.g., `MDL-0001`)
- Author email: regex validation
- All required fields enforced

#### Contact Form Validation
- All fields required (name, email, subject, message)
- Email format validated
- **Allows Formspree submission** (form action to external URL)

#### Admin User Forms
- Username: min 3 chars
- Email: regex validated
- New user: password required (min 6 chars)
- Edit user: password optional (only update if provided)

### Screenshot Placeholder: Client-Side Validation
```
[SCREENSHOT: Register form showing "Passwords do not match" alert]
[SCREENSHOT: Model form showing "Model ID must match MDL-XXXX" alert]
[SCREENSHOT: Contact form validation preventing empty submission]
```

---

## Slide 4: FR3 – Server-Side Validation

### Server-Side Checks (Cannot Be Bypassed)

#### Registration Validation (`routes/auth.js`)
```javascript
if (!username || !email || !password || !confirmPassword)
  return res.render("register", { error: "All fields are required.", old: req.body });
if (password.length < 6)
  return res.render("register", { error: "Password must be at least 6 characters.", old: req.body });
if (password !== confirmPassword)
  return res.render("register", { error: "Passwords do not match.", old: req.body });
// Also checks: duplicate username, duplicate email
```

#### Model Validation (`routes/models.js`)
```javascript
if (!model_id || !title || !author_name || !author_email || !category || !format || !file_link)
  return res.render("models/new", { error: "Please fill all required fields.", old: req.body });
const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email);
if (!emailOk)
  return res.render("models/new", { error: "Invalid email format.", old: req.body });
// Duplicate Model ID check on create
```

#### User Management Validation (`routes/users.js`)
```javascript
// Admin creating/editing users: checks duplicate username, duplicate email,
// password requirements, valid role ('admin' or 'user')
```

### Error Handling Pattern
- All validation failures **re-render the form** with `old: req.body`
- User's input is preserved so they can fix and resubmit
- Clear error messages via `error` variable displayed in template
- Failed submissions **never** reach the database

### Screenshot Placeholder: Server-Side Validation
```
[SCREENSHOT: Register with duplicate username error]
[SCREENSHOT: Model form with "Model ID already exists" error]
[SCREENSHOT: Form re-rendered with previous data preserved]
```

---

## Slide 5: FR4 – Flow Management (Routing Architecture)

### Express Routing – 4 Route Modules + Middleware

#### Route Files
| File | Purpose | Auth Required |
|------|---------|---------------|
| `routes/public.js` | Home, About, Contact | No |
| `routes/auth.js` | Login, Register, Logout | No |
| `routes/models.js` | Model CRUD | `requireLogin` |
| `routes/users.js` | User CRUD | `requireAdmin` |
| `routes/report.js` | XML/XSLT report | `requireLogin` |

#### Centralized Middleware (`routes/middleware.js`)
```javascript
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "admin") {
    req.session.flash = "Admin access required.";
    return res.redirect("/home");
  }
  next();
}
```

### Complete Route Map (20+ endpoints)

**Public:**
- `GET /` → redirect to `/home`
- `GET /home`, `/about`, `/contact`
- `GET /login`, `POST /login`, `GET /register`, `POST /register`, `GET /logout`
- `GET /healthz` → health check for Render.com

**Protected (requireLogin):**
- `GET /models` → List models (with search)
- `GET /models/new`, `POST /models/new` → Create model
- `GET /models/:id` → View model details
- `GET /models/:id/edit`, `POST /models/:id/edit` → Edit (owner/admin only)
- `POST /models/:id/delete` → Delete (owner/admin only)
- `GET /report`, `/report/html`, `/report/xml` → Report pages

**Admin Only (requireAdmin):**
- `GET /users` → List users
- `GET /users/new`, `POST /users/new` → Create user
- `GET /users/:id` → View user
- `GET /users/:id/edit`, `POST /users/:id/edit` → Edit user
- `POST /users/:id/delete` → Delete user

### Screenshot Placeholder
```
[SCREENSHOT: Public navbar (guest)]
[SCREENSHOT: Navbar (logged-in user)]
[SCREENSHOT: Navbar (admin – with Users link)]
[SCREENSHOT: Redirect to /login when accessing /models without auth]
```

---

## Slide 6: FR4 – Template Rendering (EJS Partials)

### Template Engine: Embedded JavaScript (EJS)

#### Layout + Footer Partials
The app uses **two shared partials** that wrap every page:
- `views/layout.ejs` – Opens HTML, head, header navbar, flash messages, `<main>`
- `views/footer.ejs` – Closes `</main>`, adds footer, loads `validation.js`, closes `</body></html>`

Every page includes them:
```html
<%- include("layout", { title: "Page Title" }) %>
  <!-- Page-specific content here -->
<%- include("footer") %>
```

#### View File Structure
```
views/
  ├── layout.ejs           (Header partial: nav, flash messages)
  ├── footer.ejs           (Footer partial: scripts, closing tags)
  ├── home.ejs             (Hero section + feature grid)
  ├── about.ejs            (Description + technology table)
  ├── contact.ejs          (Formspree contact form)
  ├── login.ejs            (Login form)
  ├── register.ejs         (Registration form)
  ├── 404.ejs              (Not Found page)
  ├── report.ejs           (Report with iframe)
  ├── models/
  │   ├── index.ejs        (List + search)
  │   ├── new.ejs          (Create form)
  │   ├── view.ejs         (Detail view + owner info)
  │   └── edit.ejs         (Edit form)
  └── users/
      ├── index.ejs        (User list table)
      ├── new.ejs          (Create user form)
      ├── show.ejs         (User detail view)
      └── edit.ejs         (Edit user form)
```

#### Dynamic Data Binding
```javascript
// Layout receives user info + flash messages from app-level middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  const flash = req.session.flash;
  delete req.session.flash;
  res.locals.flash = flash || null;
  next();
});
```

### Screenshot Placeholder
```
[SCREENSHOT: Shared navbar across multiple pages]
[SCREENSHOT: Flash message displayed after action]
[SCREENSHOT: Form with prefilled data (edit scenario)]
```

---

## Slide 7: FR4 – Redirects, Flash Messages & PRG Pattern

### Post-Redirect-Get (PRG) Pattern

Every write operation follows the PRG pattern to prevent duplicate submissions:

#### Create Model
```javascript
await run("INSERT INTO models (..., created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  [...values, req.session.user.id]);
req.session.flash = "Model added successfully.";
res.redirect("/models");
```

#### Update Model (with ownership check)
```javascript
if (model.created_by !== req.session.user.id && req.session.user.role !== "admin") {
  req.session.flash = "You can only edit your own models.";
  return res.redirect("/models");
}
await run("UPDATE models SET ... WHERE id = ?", [...]);
req.session.flash = "Model updated.";
res.redirect("/models/" + req.params.id);
```

#### Delete Model (with ownership check)
```javascript
if (model.created_by !== req.session.user.id && req.session.user.role !== "admin") {
  req.session.flash = "You can only delete your own models.";
  return res.redirect("/models");
}
await run("DELETE FROM models WHERE id = ?", [req.params.id]);
req.session.flash = "Model deleted.";
res.redirect("/models");
```

### Flash Message System
- Stored in `req.session.flash` (not a separate library)
- Middleware copies to `res.locals.flash` and deletes from session
- Layout template displays once and it auto-clears
- Used for success messages, permission errors, auth feedback

### Screenshot Placeholder
```
[SCREENSHOT: "Model added successfully" flash message]
[SCREENSHOT: "You can only edit your own models" error flash]
[SCREENSHOT: Delete confirmation dialog]
```

---

## Slide 8: Summary – FR3 & FR4 Completion

### FR3 Requirements – ✅ Completed
- ✅ Centralized client-side validation (`public/js/validation.js`)
- ✅ 5 form types validated: Login, Register, Model, Contact, User
- ✅ Email format regex validation (client + server)
- ✅ Model ID pattern validation (`MDL-XXXX`)
- ✅ Password matching & strength checks
- ✅ Server-side validation on all POST routes
- ✅ Duplicate rejection (Model ID, Username, Email)
- ✅ Error messages with form data retention (`old: req.body`)

### FR4 Requirements – ✅ Completed
- ✅ Modular Express routing (5 route files + middleware)
- ✅ EJS partial-based template rendering (layout + footer)
- ✅ 15 view templates organized by feature
- ✅ Role-aware navigation (guest / user / admin)
- ✅ PRG pattern for all write operations
- ✅ Flash message system (no extra library)
- ✅ Centralized auth middleware (`requireLogin`, `requireAdmin`)
- ✅ 20+ route endpoints covering all features
- ✅ 404 handler for undefined routes

---
