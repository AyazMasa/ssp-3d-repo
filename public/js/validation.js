/* ============================================================
   SSP – Client-side form validation (FR3-A)
   Inline error messages instead of alert() for better UX
   ============================================================ */

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validUrl(url) {
  return /^https?:\/\/.+/i.test(url);
}

/**
 * Show an inline error message inside a form.
 * Creates or reuses a .js-error-message element at the top of the form.
 */
function showFormError(form, msg) {
  var el = form.querySelector('.js-error-message');
  if (!el) {
    el = document.createElement('div');
    el.className = 'error-message js-error-message';
    form.insertBefore(el, form.firstChild);
  }
  el.textContent = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return false;
}

function clearFormError(form) {
  var el = form.querySelector('.js-error-message');
  if (el) el.style.display = 'none';
}

/* ---- Login ---- */
function validateLoginForm() {
  var form = document.getElementById('loginForm') || document.querySelector('form');
  var u = document.getElementById("login_username");
  var p = document.getElementById("login_password");
  if (!u || !p) return true;
  clearFormError(form);
  if (!u.value.trim()) return showFormError(form, "Please enter your username.");
  if (!p.value) return showFormError(form, "Please enter your password.");
  return true;
}

/* ---- Register ---- */
function validateRegisterForm() {
  var form = document.getElementById('registerForm') || document.querySelector('form');
  clearFormError(form);
  var u = document.getElementById("reg_username").value.trim();
  var e = document.getElementById("reg_email").value.trim();
  var p = document.getElementById("reg_password").value;
  var c = document.getElementById("reg_confirm").value;

  if (!u || !e || !p || !c) return showFormError(form, "All fields are required.");
  if (u.length < 3) return showFormError(form, "Username must be at least 3 characters.");
  if (!validEmail(e)) return showFormError(form, "Please enter a valid email address.");
  if (p.length < 6) return showFormError(form, "Password must be at least 6 characters.");
  if (p !== c) return showFormError(form, "Passwords do not match.");
  return true;
}

/* ---- Admin: Create User ---- */
function validateAdminCreateUserForm() {
  var form = document.getElementById('adminCreateUserForm') || document.querySelector('form');
  clearFormError(form);
  var u = document.getElementById("u_username").value.trim();
  var e = document.getElementById("u_email").value.trim();
  var p = document.getElementById("u_password").value;
  var r = document.getElementById("u_role").value;

  if (!u || !e || !p || !r) return showFormError(form, "All fields are required.");
  if (!validEmail(e)) return showFormError(form, "Please enter a valid email address.");
  if (p.length < 6) return showFormError(form, "Password must be at least 6 characters.");
  if (r !== "user" && r !== "admin") return showFormError(form, "Invalid role selected.");
  return true;
}

/* ---- Admin: Edit User ---- */
function validateUserEditForm() {
  var form = document.getElementById('userEditForm') || document.querySelector('form');
  clearFormError(form);
  var u = document.getElementById("e_username").value.trim();
  var e = document.getElementById("e_email").value.trim();
  var r = document.getElementById("e_role").value;

  if (!u || !e || !r) return showFormError(form, "All fields are required.");
  if (!validEmail(e)) return showFormError(form, "Please enter a valid email address.");
  if (r !== "user" && r !== "admin") return showFormError(form, "Invalid role selected.");
  return true;
}

/* ---- Model: Create ---- */
function validateModelForm() {
  var form = document.getElementById("modelForm") || document.querySelector('form');
  clearFormError(form);
  var id    = document.getElementById("model_id").value.trim();
  var title = document.getElementById("model_title").value.trim();
  var auth  = document.getElementById("model_author").value.trim();
  var email = document.getElementById("model_email").value.trim();
  var cat   = document.getElementById("model_category").value.trim();
  var fmt   = document.getElementById("model_format").value.trim();
  var link  = document.getElementById("model_link").value.trim();

  if (!id || !title || !auth || !email || !cat || !fmt || !link)
    return showFormError(form, "Please fill all required fields.");
  if (!/^[A-Za-z]{2,5}-\d{3,5}$/.test(id))
    return showFormError(form, "Model ID must follow the pattern: ABC-1234 (2-5 letters, dash, 3-5 digits).");
  if (!validEmail(email))
    return showFormError(form, "Please enter a valid author email.");
  if (!validUrl(link))
    return showFormError(form, "File link must be a valid URL starting with http:// or https://");
  return true;
}

/* ---- Model: Edit ---- */
function validateModelEditForm() {
  var form = document.getElementById("modelEditForm") || document.querySelector('form');
  clearFormError(form);
  var title = document.getElementById("edit_title").value.trim();
  var auth  = document.getElementById("edit_author").value.trim();
  var email = document.getElementById("edit_email").value.trim();
  var cat   = document.getElementById("edit_category").value.trim();
  var fmt   = document.getElementById("edit_format").value.trim();
  var link  = document.getElementById("edit_link").value.trim();

  if (!title || !auth || !email || !cat || !fmt || !link)
    return showFormError(form, "Please fill all required fields.");
  if (!validEmail(email))
    return showFormError(form, "Please enter a valid author email.");
  if (!validUrl(link))
    return showFormError(form, "File link must be a valid URL starting with http:// or https://");
  return true;
}

/* ---- Contact (handled by AJAX in contact.ejs now) ---- */
function validateContactForm() {
  var form = document.getElementById("contactForm") || document.querySelector('form');
  clearFormError(form);
  var name  = document.getElementById("contact_name").value.trim();
  var email = document.getElementById("contact_email").value.trim();
  var msg   = document.getElementById("contact_message").value.trim();

  if (!name || !email || !msg) return showFormError(form, "Please fill all required fields.");
  if (!validEmail(email)) return showFormError(form, "Please enter a valid email address.");

  return true;
}
