# 3D Models Repository Portal

Course: Internet Technologies

Project: Progressive Web Application Development

## 📌 Project Description

This project is a full-stack web application that functions as a public repository for 3D models/schematics.

The system allows an administrator to manage model records (CRUD operations) through a secure session-based interface. It demonstrates practical use of:

- HTML5 & CSS3
- JavaScript (client-side validation)
- Node.js + Express (backend framework)
- SQLite (relational database)
- XML export
- XSLT transformation to HTML
- Session management and access control

The project was developed progressively according to course laboratory requirements.

## 🚀 How to Run the Project

### 1️⃣ Install Dependencies

In the project root folder:

```
npm install
```

### 2️⃣ Start Development Server

```
npm run dev
```

Server will run at:

http://localhost:3000

## 🔐 Login Credentials (Admin)

- Username: admin
- Password: admin123

## 🗄 Database Setup

The project uses SQLite.

**Option 1 (Recommended)**

Database is automatically created when the server starts.

**Option 2 (Manual Setup)**

Run the SQL file located at:

```
db/init.sql
```

It creates:

- models table
- required fields
- constraints (unique model_id)

Database file:

```
db/database.sqlite
```

## 🧩 Implemented Features

### FR1 – Public Pages

- Home page
- About page
- Contact page (UI form)

### FR2 – Model Management (CRUD)

- List models
- View model details
- Add new model
- Edit model
- Delete model

Each model includes:

- Model ID (unique)
- Title
- Author Name
- Author Email
- Category
- Format
- File Link
- Visibility Status
- Created Timestamp

### FR3 – Data Validation

Client-side (JavaScript):

- Required field validation
- Email format validation
- Model ID pattern validation

Server-side:

- Required field checks
- Duplicate Model ID rejection
- Error message display

### FR4 – Flow Management & Templates

- Express routing
- Template rendering using EJS
- Clean navigation flow
- Redirects after CRUD operations

Routes include:

- /home
- /models
- /models/new
- /models/:id
- /models/:id/edit
- /report

### FR5 – Session Management

- Login page
- Logout
- Protected routes
- Flash success messages
- Access restriction when not logged in

### FR6 – XML + XSLT

- Export models to XML
- Transform XML to HTML using XSLT
- Display formatted report in browser

XML file generated in:

```
xml/models.xml
```

## ⭐ Bonus Feature – Search Functionality

The system includes a server-side search feature on the models list page.

Users can search by:

- Model ID
- Title
- Author Name
- Category

Search is implemented using SQL LIKE queries and URL query parameters:

```
/models?search=value
```

## 📁 Project Structure

```
routes/
views/
db/
xml/
public/
app.js
```

## 🧠 Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite
- XML
- XSLT (Saxon-JS)