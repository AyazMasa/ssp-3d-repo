# Presentation 1: Functional Requirements FR1 & FR2
## Internet Technologies - Progressive Web Application Development

**Student:** Ayaz Masa  
**Student ID:** 20233943  
**Date:** 4th March  
**Weight:** 10% of course grade  
**Live URL:** https://ssp-3d-repo.onrender.com

---

## Slide 1: Title Slide

### SSP – 3D Schematics Repository Portal
#### Presentation 1: Public Pages & CRUD Management

- **Course:** Internet Technologies
- **Student:** Ayaz Masa (ID: 20233943)
- **Presentation Date:** 4th March
- **Focus:** Functional Requirements FR1 & FR2

---

## Slide 2: Project Overview

### What is the SSP 3D Repository?

A full-stack web application that:
- Serves as a centralized repository for 3D models/schematics
- Supports public registration and role-based access (admin & user)
- Full CRUD for both **models** and **users**
- Real email delivery via Formspree contact form
- XML/XSLT report generation
- Deployed live on Render.com

### Key Technologies
- **Frontend:** HTML5, CSS3 (custom properties, responsive), JavaScript, EJS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (with auto-migration)
- **Auth:** bcryptjs, express-session
- **Additional:** XML, XSLT (Saxon-JS), Formspree, Render.com

---

## Slide 3: FR1 – Public Pages

### Requirement: Create accessible public pages

**Implemented Pages:**

1. **Home Page** (`/home`)
   - Hero section with call-to-action buttons
   - Feature grid showcasing system capabilities (6 cards)
   - Dynamic CTAs: "Get Started / Sign In" (guest) vs "Browse Models / Add New" (logged in)

2. **About Page** (`/about`)
   - Detailed system description
   - Feature cards (HTML5, JS, XML, Express, SQLite, Sessions)
   - Technology table with all 9 dependencies explained

3. **Contact Page** (`/contact`)
   - **Working contact form via Formspree** (sends real email notifications)
   - Client-side validation before submission
   - Fields: Name, Email, Subject, Message
   - Hidden `_subject` field for email notifications

### Screenshots: Public Pages

![Home page hero + feature grid](../Screenshots/home-hero.png)

![About page with technology table](../Screenshots/about-tech-table.png)

![Contact page form](../Screenshots/contact-form.png)

![Formspree email notification received](../Screenshots/formspree-email.png)

---

## Slide 4: FR2 – Model Management (CRUD) - Part 1

### Requirement: Full CRUD operations for model records

#### List All Models (`/models`)
- Authenticated access only
- Table view with all fields
- **Search bar** – filter by Model ID, Title, Author, Category
- Action buttons: View, Edit, Delete (conditional on ownership)

#### View Model Details (`/models/:id`)
- Full detail grid layout
- Shows "Added By" (owner username)
- Edit button visible only to owner or admin
- Linked author email, file link

### Ownership System
- Every model tracks `created_by` (user ID of creator)
- Regular users can only **Edit/Delete their own models**
- Admins can edit/delete any model

### Screenshots: Read Operations

![Models list page with search bar](../Screenshots/models-list-search.png)

![Model detail view with Added By](../Screenshots/model-detail-added-by.png)

![Model list as regular user – no edit/delete on others' models](../Screenshots/models-list-regular-user.png)

---

## Slide 5: FR2 – Model Management (CRUD) - Part 2

### Create Model (`/models/new`)
- Two-column form layout with required field indicators
- Fields: Model ID, Title, Author Name/Email, Category, Format, File Link, Visibility
- Client-side validation (pattern: `MDL-0001`, email format)
- Server-side: duplicate Model ID rejection, email format check
- `created_by` is set automatically to current user's ID

### Edit Model (`/models/:id/edit`)
- Pre-filled form with current data
- Model ID is read-only
- **Access restricted** to model owner or admin (server-side enforced)

### Delete Model (`/models/:id/delete`)
- Confirmation dialog before deletion
- **Access restricted** to model owner or admin
- Flash message on successful deletion

### Screenshots: Create/Edit/Delete

![Add New Model form](../Screenshots/add-model-form.png)

![Edit Model form (pre-filled)](../Screenshots/edit-model-form.png)

![Delete confirmation dialog](../Screenshots/delete-confirmation.png)

![Model added successfully flash message](../Screenshots/model-added-flash.png)

---

## Slide 6: FR2 – User Management (CRUD, Admin Only)

### Requirement: Full user record management

This was added to satisfy the lecturer's requirement for **user management** beyond just admin login.

#### User CRUD Routes (all require `requireAdmin` middleware)
- `GET /users` – List all users (table: ID, Username, Email, Role, Created)
- `GET /users/new` – Add user form (username, email, password, role)
- `GET /users/:id` – View user details
- `GET /users/:id/edit` – Edit user (username, email, role)
- `POST /users/:id/delete` – Delete user (cannot delete yourself)

#### Access Control
- Only users with `role = 'admin'` can access `/users` routes
- "Users" link in navbar only visible to admins
- Server-side `requireAdmin` middleware enforces this

### Screenshots: User Management

![Users list page (admin view)](../Screenshots/users-list-admin.png)

![Add User form with role selector](../Screenshots/add-user-form.png)

![User detail view](../Screenshots/user-detail.png)

![Redirect when regular user tries /users](../Screenshots/user-access-denied.png)

---

## Slide 7: Data Model & Database Schema

### Models Table

| Field | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| model_id | TEXT | NOT NULL, UNIQUE |
| title | TEXT | NOT NULL |
| author_name | TEXT | NOT NULL |
| author_email | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| format | TEXT | NOT NULL |
| file_link | TEXT | NOT NULL |
| visibility_status | TEXT | NOT NULL |
| created_by | INTEGER | FK → users(id) |
| created_at | TEXT | DEFAULT datetime('now') |

### Users Table

| Field | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| username | TEXT | NOT NULL, UNIQUE |
| email | TEXT | NOT NULL, UNIQUE |
| password_hash | TEXT | NOT NULL |
| role | TEXT | NOT NULL, DEFAULT 'user' |
| created_at | TEXT | DEFAULT datetime('now') |

### Database Features
- Auto-created on first startup
- Auto-migration: adds `created_by` column if missing
- Admin seeded via `node db/seedAdmin.js`

---

## Slide 8: Summary – FR1 & FR2 Completion

### FR1 – Public Pages ✅
- ✅ Home page with hero section and feature grid
- ✅ About page with system description and technology table
- ✅ Contact page with **working Formspree email delivery**

### FR2 – Model CRUD ✅
- ✅ List models with search and filtering
- ✅ View model details with owner info
- ✅ Create model with ownership tracking
- ✅ Edit model (owner/admin only)
- ✅ Delete model with confirmation (owner/admin only)

### FR2 – User CRUD (Admin) ✅
- ✅ List, view, create, edit, delete users
- ✅ Admin-only access enforced by middleware
- ✅ Role assignment (admin/user)

### Beyond Requirements
- Ownership-based access control on models
- Working contact form (not just UI demo)
- Modern UI with responsive design
- Live deployment on Render.com

---

## Notes for Presenter

- Demonstrate each CRUD operation with live examples
- Show the database table structure if questions arise
- Highlight error handling (duplicate Model ID, required fields)
- Show session protection (login required for `/models`)
- Mention database auto-initialization feature
