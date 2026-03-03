# Presentation 3: Functional Requirements FR5 & FR6 + Non-Functional Requirements
## Internet Technologies - Progressive Web Application Development

**Student:** Ayaz Masa  
**Student ID:** 20233943  
**Date:** 13th May  
**Weight:** 20% of course grade

---

## Slide 1: Title Slide

### 3D Models Repository Portal
#### Presentation 3: Session Management, XML/XSLT, & Quality Requirements

- **Course:** Internet Technologies
- **Semester:** Current
- **Student:** Ayaz Masa (ID: 20233943)
- **Presentation Date:** 13th May
- **Focus:** FR5 & FR6 + Non-Functional Requirements (NFR)

---

## Slide 2: FR5 Overview – Session Management

### Requirement: Implement secure session-based access control

### What is Session Management?
- Maintains user state across multiple requests
- Stores authentication information
- Protects sensitive routes from unauthorized access
- Uses cookies (secure, httpOnly by default)

### Session Implementation
```
User Login
    ↓
[Create session] → req.session.user = { username: "admin" }
    ↓
[Store session cookie in browser]
    ↓
[Protected resources now accessible]
    ↓
User Logout
    ↓
[Destroy session] → req.session.destroy()
    ↓
[No longer authenticated]
```

---

## Slide 3: FR5 – Login & Logout

### Login Page (`/login`)
- Username and password input
- Form validation before submission
- Test credentials: `admin` / `admin123`
- Error message on invalid credentials

### Login Route
```javascript
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    req.session.user = { username };
    req.session.message = "Logged in successfully.";
    return res.redirect("/models");
  }
  return res.render("login", { 
    error: "Invalid credentials." 
  });
});
```

### Logout Route
```javascript
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});
```

### Screenshot Placeholder: Login/Logout
```
[SCREENSHOT: Login form with test credentials displayed]
[SCREENSHOT: Error message on invalid login]
[SCREENSHOT: Navbar showing logged-in user]
[SCREENSHOT: Logout link in navbar]
[SCREENSHOT: Redirect to home after logout]
```

---

## Slide 4: FR5 – Protected Routes & Flash Messages

### Middleware: `requireLogin`
```javascript
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

router.get("/models", requireLogin, async (req, res) => {
  // Protected route
});
```

### Navbar Dynamic Content
```html
<% if (user) { %>
  <span>Logged in as <%= user.username %></span>
  <a href="/logout">Logout</a>
<% } else { %>
  <a href="/login">Login</a>
<% } %>
```

### Flash Messages (Session Feedback)
- Stored in: `req.session.message`
- Displayed once per session
- Auto-cleared: `delete req.session.message`
- Shows on redirect to next page

### Session Data Storage
- **Driver:** SQLite (`connect-sqlite3`)
- **Location:** `db/sessions.sqlite`
- **Auto-created:** On first use
- **Security:** Signed cookies prevent tampering

### Screenshot Placeholder: Protected Routes & Messages
```
[SCREENSHOT: Redirect to login when accessing /models without auth]
[SCREENSHOT: Navbar with "Logged in as admin"]
[SCREENSHOT: Green success message after login]
[SCREENSHOT: Flask message after model creation]
```

---

## Slide 5: FR6 – XML Export

### Requirement: Export model data to XML format

### XML Generation Process
```
Database Query (SELECT * FROM models)
    ↓
[Format each row as XML element]
    ↓
[Escape special characters]
    ↓
[Wrap in root element with timestamp]
    ↓
[Write to file: xml/models.xml]
    ↓
[Send to browser as application/xml]
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
```

### Route: `/report/xml`
- Protected route (login required)
- Generates XML from all models
- Saves to `xml/models.xml`
- Returns XML to browser

### Screenshot Placeholder: XML Export
```
[SCREENSHOT: /report/xml showing XML in browser]
[SCREENSHOT: Downloaded models.xml file]
[SCREENSHOT: XML structure with sample data]
[SCREENSHOT: File stored in xml/ folder]
```

---

## Slide 6: FR6 – XSLT Transformation

### Requirement: Transform XML to HTML using XSLT

### XSLT (Extensible Stylesheet Language Transformation)
- W3C standard for XML transformations
- Declarative language (XML-based)
- Creates HTML from XML data
- Used for reports, formatting, filtering

### Transformation Pipeline
```
XML (models.xml)
    ↓
[Load XSLT stylesheet: models.xsl]
    ↓
[Saxon-JS XSLT processor]
    ↓
[Apply transformation rules]
    ↓
[Generate HTML output]
    ↓
[Display in browser]
```

### XSLT Example (models.xsl)
```xsl
<xsl:for-each select="/models/model">
  <tr>
    <td><xsl:value-of select="model_id"/></td>
    <td><xsl:value-of select="title"/></td>
    <td><xsl:value-of select="author_name"/></td>
    <!-- More columns -->
  </tr>
</xsl:for-each>
```

### Report Features
- Styled HTML table
- Model count total
- Generation timestamp
- Hyperlinked file links
- Professional CSS styling

### Technology Stack
- **XSLT Processor:** Saxon-JS (pure JavaScript)
- **XSLT Version:** 3.0
- **Compilation:** SEF JSON file (models.sef.json)
- **Performance:** Pre-compiled for speed

### Route: `/report`
- Protected route (login required)
- Access via "Report" link in navbar
- Displays formatted HTML table
- Shows all models with metadata

### Screenshot Placeholder: XSLT Report
```
[SCREENSHOT: /report showing formatted HTML table]
[SCREENSHOT: Report header with "Total:" count]
[SCREENSHOT: Generated timestamp]
[SCREENSHOT: Table with all model data]
[SCREENSHOT: Hyperlinked file links in report]
```

---

## Slide 7: Non-Functional Requirements (Quality)

### NFR1 – Performance
- ✅ **Fast data retrieval:** SQLite queries optimized with indexes
- ✅ **Efficient rendering:** EJS templates pre-compiled
- ✅ **XSLT optimization:** Pre-compiled SEF JSON format
- ✅ **Asynchronous operations:** Async/await for non-blocking I/O

### NFR2 – Security
- ✅ **Session-based authentication:** Secure cookie storage
- ✅ **SQL injection prevention:** Parameterized queries (? placeholders)
- ✅ **XSS protection:** HTML escaping in templates
- ✅ **XML injection prevention:** Character escaping in XML output
- ✅ **Route protection:** Middleware enforces access control

### NFR3 – Usability
- ✅ **Intuitive navigation:** Clear navbar with all main links
- ✅ **Responsive design:** CSS flexbox layout
- ✅ **Error handling:** User-friendly error messages
- ✅ **Form feedback:** Required field indicators, prefilled forms
- ✅ **Confirmation dialogs:** Prevent accidental deletions

### NFR4 – Maintainability
- ✅ **Modular code structure:** Separate route/view files
- ✅ **Database schema:** Clear, normalized table design
- ✅ **Comments & documentation:** Code is well-commented
- ✅ **Configuration:** Centralized app.js setup
- ✅ **Version control:** Ready for Git repository

### NFR5 – Scalability
- ✅ **Database design:** Can handle growing model count
- ✅ **Search functionality:** Indexed queries for fast filtering
- ✅ **Session persistence:** SQLite sessions scalable
- ✅ **Static file serving:** Separate public/ folder

### NFR6 – Compatibility
- ✅ **Browser support:** HTML5, modern JavaScript
- ✅ **OS independent:** Cross-platform (Windows, Mac, Linux)
- ✅ **Node.js version:** Tested on v24.13.1

---

## Slide 8: Complete Feature Summary + Bonus

### All Functional Requirements – ✅ Completed

| Requirement | Status | Details |
|-------------|--------|---------|
| FR1: Public Pages | ✅ | Home, About, Contact pages |
| FR2: CRUD Operations | ✅ | Create, Read, Update, Delete models |
| FR3: Data Validation | ✅ | Client-side + Server-side validation |
| FR4: Flow Management | ✅ | Routing, templates, redirects |
| FR5: Session Management | ✅ | Login, logout, protected routes |
| FR6: XML + XSLT | ✅ | Export to XML, transform to HTML report |

### Bonus Feature: Search Functionality
- ✅ Server-side search on `/models?search=value`
- ✅ Search by: Model ID, Title, Author Name, Category
- ✅ SQL LIKE queries for flexible filtering
- ✅ Search form with Reset button

### Non-Functional Requirements – ✅ Achieved
- ✅ Performance optimizations
- ✅ Security best practices
- ✅ User-friendly interface
- ✅ Maintainable code structure
- ✅ Scalable database design
- ✅ Cross-platform compatibility

### Project Delivery
- **Total Routes:** 13 functional endpoints
- **Database Views:** 8 EJS templates
- **Functionality:** 100% complete
- **Quality:** Production-ready code

---

## Slide 9: Technical Highlights & Learning Outcomes

### Technologies Demonstrated
- Modern Node.js/Express backend development
- Relational database design with SQLite
- Secure session management
- Advanced XML/XSLT processing
- Server-side template rendering
- Full-stack web application architecture

### Security Best Practices Implemented
- Parameterized SQL queries (prevent injection)
- HTML escaping (prevent XSS)
- Session-based authentication
- Access control middleware
- Secure cookie handling

### Lessons Learned
- Importance of server-side validation
- Separation of concerns (routes, views, models)
- User experience feedback (flash messages)
- Data integrity through constraints
- Professional error handling

### Code Quality
- Clean, readable code structure
- Consistent naming conventions
- Comprehensive error handling
- Modular route/view organization
- Documentation and comments

---

## Notes for Presenter

- Demonstrate the complete user journey (login → create → view → edit → report)
- Show XML export and XSLT transformation live
- Explain security measures when questioned
- Discuss performance optimizations (pre-compiled XSLT)
- Highlight search functionality as bonus feature
- Show database schema and data integrity constraints
- Explain the technology choices and their benefits
- Be prepared to discuss scalability for future enhancements
