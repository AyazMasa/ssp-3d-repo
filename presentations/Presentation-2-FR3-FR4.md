# Presentation 2: Functional Requirements FR3 & FR4
## Internet Technologies - Progressive Web Application Development

**Student:** Ayaz Masa  
**Student ID:** 20233943  
**Date:** 8th April  
**Weight:** 10% of course grade

---

## Slide 1: Title Slide

### 3D Models Repository Portal
#### Presentation 2: Data Validation & Flow Management

- **Course:** Internet Technologies
- **Semester:** Current
- **Student:** Ayaz Masa (ID: 20233943)
- **Presentation Date:** 8th April
- **Focus:** Functional Requirements FR3 & FR4

---

## Slide 2: FR3 Overview – Data Validation

### Requirement: Implement client-side and server-side validation

### Why Both Layers?
- **Client-side:** Immediate user feedback, better UX
- **Server-side:** Security, data integrity (cannot be bypassed)

### Validation Strategy
```
User Input 
    ↓
[Client-side checks] 
    ↓ Pass
[Send to server]
    ↓
[Server-side checks]
    ↓ Pass
[Store in database]
```

---

## Slide 3: FR3 – Client-Side Validation

### JavaScript-Based Validation

#### Required Fields
- All form fields marked with `*` are required
- Browser's HTML5 `required` attribute enforces this
- User cannot submit empty form

#### Email Format Validation
- Pattern: `user@domain.com`
- Uses HTML5 `type="email"` attribute
- Browser validates format before submission

#### Model ID Format
- Text input with pattern enforcement
- Examples: `MDL-0001`, `MODEL-001`, etc.
- Prevents invalid patterns

### Visual Feedback
- Red error messages on validation failure
- Form is NOT submitted if validation fails
- Clear, user-friendly error messages

### Screenshot Placeholder: Client-Side Validation
```
[SCREENSHOT: Form with required field empty, show validation message]
[SCREENSHOT: Invalid email format, show validation error]
[SCREENSHOT: Form with all fields filled correctly]
```

---

## Slide 4: FR3 – Server-Side Validation

### Server-Side Checks (Cannot Be Bypassed)

#### Required Field Verification
```javascript
if (!model_id || !title || !author_name || !author_email 
    || !category || !format || !file_link) {
  return error("Please fill all required fields.");
}
```

#### Email Format Validation
```javascript
const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email);
if (!emailOk) {
  return error("Invalid email format.");
}
```

#### Duplicate Model ID Check
```javascript
const existing = await get("SELECT id FROM models WHERE model_id = ?", [model_id]);
if (existing) {
  return error("Model ID already exists.");
}
```

### Error Handling
- Validation failures show form with previous data (`old: req.body`)
- User can correct and resubmit
- Failed submissions do NOT save to database

### Screenshot Placeholder: Server-Side Validation
```
[SCREENSHOT: Form submission with missing required field]
[SCREENSHOT: Server error message about duplicate Model ID]
[SCREENSHOT: Invalid email error on server]
[SCREENSHOT: Form re-rendered with user data for correction]
```

---

## Slide 5: FR4 – Flow Management (Routing)

### Express Routing Architecture

#### Public Routes (`/home`, `/about`, `/contact`)
- No authentication required
- Accessible to any visitor
- Displayed in navbar for all users

#### Protected Routes (all `/models` routes)
- Require login via session
- `requireLogin` middleware checks `req.session.user`
- Redirect to `/login` if not authenticated

#### Authorization Pattern
```javascript
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}
```

### Complete Route List
- `GET /` → redirect to `/home`
- `GET /home`, `/about`, `/contact` → Public pages
- `GET /login` → Login form
- `POST /login` → Authenticate user
- `GET /logout` → Clear session
- `GET /models` → List (protected)
- `GET /models/new` → Add form (protected)
- `POST /models/new` → Create (protected)
- `GET /models/:id` → View (protected)
- `GET /models/:id/edit` → Edit form (protected)
- `POST /models/:id/edit` → Update (protected)
- `POST /models/:id/delete` → Delete (protected)
- `GET /report` → XML/XSLT report (protected)

### Screenshot Placeholder: Navigation Flow
```
[SCREENSHOT: Public navbar (not logged in)]
[SCREENSHOT: Protected navbar (after login)]
[SCREENSHOT: Redirect to login when accessing /models without auth]
[SCREENSHOT: Route flow diagram]
```

---

## Slide 6: FR4 – Template Rendering (EJS)

### Template Engine: Embedded JavaScript (EJS)

#### Master Layout (`views/layout.ejs`)
- Shared HTML structure
- Navigation bar (Links, Login/Logout)
- Session message display
- CSS styling from `public/css/style.css`

#### Child Templates
- Use `<%- include("../layout", { title, body: \`...\` }) %>`
- Pass data to layout
- Dynamic content rendering

### View Files
```
views/
  ├── layout.ejs           (Master template)
  ├── home.ejs             (Home page)
  ├── about.ejs            (About page)
  ├── contact.ejs          (Contact form)
  ├── login.ejs            (Login form)
  ├── models/
  │   ├── index.ejs        (List view)
  │   ├── new.ejs          (Create form)
  │   ├── view.ejs         (Detail view)
  │   └── edit.ejs         (Edit form)
  └── report.ejs           (Report placeholder)
```

### Dynamic Data Binding
```javascript
res.render("models/index", { 
  title: "Models", 
  models: [...],          // Loop in template
  search: queryParam       // Display in form
});
```

### Screenshot Placeholder: Template Rendering
```
[SCREENSHOT: Page showing shared navbar and layout]
[SCREENSHOT: Different pages using same layout structure]
[SCREENSHOT: Form with prefilled data (edit scenario)]
```

---

## Slide 7: FR4 – Redirects & User Feedback

### Post-Action Redirects (PRG Pattern)

#### Create Model
```javascript
await run("INSERT INTO models...", [...]);
req.session.message = "Model added successfully.";
res.redirect("/models");  // Redirect, flash message shown
```

#### Update Model
```javascript
await run("UPDATE models...", [...]);
req.session.message = "Model updated.";
res.redirect("/models");
```

#### Delete Model
```javascript
await run("DELETE FROM models...", [req.params.id]);
req.session.message = "Model deleted.";
res.redirect("/models");
```

### Flash Messages
- Store in session: `req.session.message`
- Display in layout once
- Auto-clear after render: `delete req.session.message`

### Screenshot Placeholder: User Feedback
```
[SCREENSHOT: Green success message after add]
[SCREENSHOT: "Model updated" message]
[SCREENSHOT: Confirmation dialog before delete]
[SCREENSHOT: "Model deleted" message]
```

---

## Slide 8: Summary – FR3 & FR4 Completion

### FR3 Requirements – ✅ Completed
- ✅ Client-side validation (HTML5 + JavaScript)
- ✅ Email format validation
- ✅ Required field validation
- ✅ Server-side validation for security
- ✅ Duplicate Model ID rejection
- ✅ Error messages with form data retention

### FR4 Requirements – ✅ Completed
- ✅ Express routing architecture
- ✅ EJS template rendering
- ✅ Master layout with shared UI
- ✅ Child templates for content
- ✅ Data binding and dynamic content
- ✅ Clean navigation flow
- ✅ PRG (Post-Redirect-Get) pattern
- ✅ Session-based flash messages
- ✅ User feedback on all operations

### Quality Achieved
- Data integrity through validation
- User-friendly error messages
- Smooth navigation experience
- Session protection
- Consistent UI across all pages

---

## Notes for Presenter

- Demonstrate form validation by attempting invalid inputs
- Show error messages and how form data is retained
- Walk through the routing flow (public vs. protected routes)
- Explain the redirect pattern and why it prevents duplicate submissions
- Show flash messages appearing after operations
- Discuss security benefits of server-side validation
- Mention auto-clearing of flash messages
