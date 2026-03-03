/* ============================================================
   SSP – Client-side form validation (FR3-A)
   ============================================================ */

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(msg) {
  alert(msg);
  return false;
}

/* ---- Login ---- */
function validateLoginForm() {
  var u = document.getElementById("login_username");
  var p = document.getElementById("login_password");
  if (!u || !p) return true;
  if (!u.value.trim()) return showError("Please enter your username.");
  if (!p.value) return showError("Please enter your password.");
  return true;
}

/* ---- Register ---- */
function validateRegisterForm() {
  var u = document.getElementById("reg_username").value.trim();
  var e = document.getElementById("reg_email").value.trim();
  var p = document.getElementById("reg_password").value;
  var c = document.getElementById("reg_confirm").value;

  if (!u || !e || !p || !c) return showError("All fields are required.");
  if (u.length < 3) return showError("Username must be at least 3 characters.");
  if (!validEmail(e)) return showError("Please enter a valid email address.");
  if (p.length < 6) return showError("Password must be at least 6 characters.");
  if (p !== c) return showError("Passwords do not match.");
  return true;
}

/* ---- Admin: Create User ---- */
function validateAdminCreateUserForm() {
  var u = document.getElementById("u_username").value.trim();
  var e = document.getElementById("u_email").value.trim();
  var p = document.getElementById("u_password").value;
  var r = document.getElementById("u_role").value;

  if (!u || !e || !p || !r) return showError("All fields are required.");
  if (!validEmail(e)) return showError("Please enter a valid email address.");
  if (p.length < 6) return showError("Password must be at least 6 characters.");
  if (r !== "user" && r !== "admin") return showError("Invalid role selected.");
  return true;
}

/* ---- Admin: Edit User ---- */
function validateUserEditForm() {
  var u = document.getElementById("e_username").value.trim();
  var e = document.getElementById("e_email").value.trim();
  var r = document.getElementById("e_role").value;

  if (!u || !e || !r) return showError("All fields are required.");
  if (!validEmail(e)) return showError("Please enter a valid email address.");
  if (r !== "user" && r !== "admin") return showError("Invalid role selected.");
  return true;
}

/* ---- Model: Create ---- */
function validateModelForm() {
  var id    = document.getElementById("model_id").value.trim();
  var title = document.getElementById("model_title").value.trim();
  var auth  = document.getElementById("model_author").value.trim();
  var email = document.getElementById("model_email").value.trim();
  var cat   = document.getElementById("model_category").value.trim();
  var fmt   = document.getElementById("model_format").value.trim();
  var link  = document.getElementById("model_link").value.trim();

  if (!id || !title || !auth || !email || !cat || !fmt || !link)
    return showError("Please fill all required fields.");
  if (!/^[A-Za-z]{2,5}-\d{3,5}$/.test(id))
    return showError("Model ID must follow the pattern: ABC-1234 (2-5 letters, dash, 3-5 digits).");
  if (!validEmail(email))
    return showError("Please enter a valid author email.");
  return true;
}

/* ---- Model: Edit ---- */
function validateModelEditForm() {
  var title = document.getElementById("edit_title").value.trim();
  var auth  = document.getElementById("edit_author").value.trim();
  var email = document.getElementById("edit_email").value.trim();
  var cat   = document.getElementById("edit_category").value.trim();
  var fmt   = document.getElementById("edit_format").value.trim();
  var link  = document.getElementById("edit_link").value.trim();

  if (!title || !auth || !email || !cat || !fmt || !link)
    return showError("Please fill all required fields.");
  if (!validEmail(email))
    return showError("Please enter a valid author email.");
  return true;
}

/* ---- Contact (Formspree) ---- */
function validateContactForm() {
  var name  = document.getElementById("contact_name").value.trim();
  var email = document.getElementById("contact_email").value.trim();
  var msg   = document.getElementById("contact_message").value.trim();

  if (!name || !email || !msg) return showError("Please fill all required fields.");
  if (!validEmail(email)) return showError("Please enter a valid email address.");

  return true; // allow form to submit to Formspree
}
