# Presentation 1: Functional Requirements FR1 & FR2
## Internet Technologies - Progressive Web Application Development

**Student:** Ayaz Masa  
**Student ID:** 20233943  
**Date:** 4th March  
**Weight:** 10% of course grade

---

## Slide 1: Title Slide

### 3D Models Repository Portal
#### Progressive Web Application Development

- **Course:** Internet Technologies
- **Semester:** Current
- **Student:** Ayaz Masa (ID: 20233943)
- **Presentation Date:** 4th March
- **Focus:** Functional Requirements FR1 & FR2

---

## Slide 2: Project Overview

### What is the 3D Models Repository Portal?

A full-stack web application that:
- Serves as a public repository for 3D models/schematics
- Provides administrator CRUD functionality
- Demonstrates modern web technologies (Node.js, Express, SQLite, XML, XSLT)
- Implements session-based access control

### Key Technologies
- **Frontend:** HTML5, CSS3, JavaScript, EJS templates
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Additional:** XML, XSLT (Saxon-JS)

---

## Slide 3: FR1 – Public Pages

### Requirement: Create accessible public pages

**Implemented Pages:**

1. **Home Page** (`/home`)
   - Introduction to the platform
   - Portal description
   - Links to other sections

2. **About Page** (`/about`)
   - System description
   - Technologies overview
   - Features summary

3. **Contact Page** (`/contact`)
   - User inquiry form interface
   - Email and message input fields
   - (UI demonstration)

### Screenshot Placeholder: Public Pages Navigation
```
[SCREENSHOT: Navbar showing Home, About, Contact, Models, Report links]
[SCREENSHOT: Home page main content]
[SCREENSHOT: About page content]
[SCREENSHOT: Contact page form]
```

---

## Slide 4: FR2 – Model Management (CRUD) - Part 1

### Requirement: Create, Read, Update, Delete model records

#### Read – View All Models (`/models`)
- Access restricted to authenticated users
- Displays table of all models
- Shows: Model ID, Title, Category, Format, Status, Created Date
- Includes View/Edit/Delete action buttons

#### Read – View Single Model (`/models/:id`)
- Detailed view of individual model
- Displays all model information:
  - Model ID, Title, Author (Name & Email)
  - Category, Format, File Link
  - Visibility Status, Created Timestamp

### Screenshot Placeholder: View Operations
```
[SCREENSHOT: Models list page with table]
[SCREENSHOT: Single model detail view]
[SCREENSHOT: Action links (View, Edit, Delete)]
```

---

## Slide 5: FR2 – Model Management (CRUD) - Part 2

### Create – Add New Model (`/models/new`)
- Form with required fields:
  - Model ID (unique), Title, Author Name, Author Email
  - Category, Format, File Link, Visibility Status
- Form validation and error handling
- Success message on creation

### Update – Edit Model (`/models/:id/edit`)
- Prefilled form with current model data
- Model ID field is read-only (cannot change unique ID)
- Validates all required fields before update
- Success message on update

### Delete – Remove Model (`/models/:id/delete`)
- Confirmation dialog before deletion
- Removes record from database
- Redirects to model list with success message

### Screenshot Placeholder: Create/Edit/Delete Operations
```
[SCREENSHOT: "Add New Model" form]
[SCREENSHOT: "Edit Model" form with prefilled data]
[SCREENSHOT: Delete confirmation dialog]
[SCREENSHOT: Success message after CRUD operation]
```

---

## Slide 6: Data Model & Database Schema

### Models Table Structure

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| model_id | TEXT | NOT NULL, UNIQUE |
| title | TEXT | NOT NULL |
| author_name | TEXT | NOT NULL |
| author_email | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| format | TEXT | NOT NULL |
| file_link | TEXT | NOT NULL |
| visibility_status | TEXT | NOT NULL |
| created_at | TEXT | DEFAULT (datetime('now')) |

### Database File
- **Location:** `db/database.sqlite`
- **Init Script:** `db/init.sql`
- **Auto-creation:** Schema created on first server startup

---

## Slide 7: Implementation Highlights - Routes & Views

### Backend (Express Routes)
- `GET /models` – List all models
- `GET /models/new` – Show add form
- `POST /models/new` – Create model
- `GET /models/:id` – View single model
- `GET /models/:id/edit` – Show edit form
- `POST /models/:id/edit` – Update model
- `POST /models/:id/delete` – Delete model

### Frontend (EJS Templates)
- `views/models/index.ejs` – List view
- `views/models/new.ejs` – Create form
- `views/models/view.ejs` – Detail view
- `views/models/edit.ejs` – Edit form
- `views/layout.ejs` – Master layout

### Screenshot Placeholder: Navigation Flow
```
[SCREENSHOT: Navigation flow diagram or screenshots showing transitions between pages]
```

---

## Slide 8: Summary – FR1 & FR2 Completion

### FR1 Requirements – ✅ Completed
- ✅ Public home page with portal description
- ✅ About page detailing technologies
- ✅ Contact page with form UI

### FR2 Requirements – ✅ Completed
- ✅ List all models in database
- ✅ View individual model details
- ✅ Create new model with validation
- ✅ Edit existing model
- ✅ Delete model with confirmation
- ✅ All CRUD operations fully functional

### User Experience
- Clean, intuitive navigation
- Responsive layout
- Clear action buttons
- Success/error message feedback
- Data integrity (unique Model ID constraint)

---

## Notes for Presenter

- Demonstrate each CRUD operation with live examples
- Show the database table structure if questions arise
- Highlight error handling (duplicate Model ID, required fields)
- Show session protection (login required for `/models`)
- Mention database auto-initialization feature
