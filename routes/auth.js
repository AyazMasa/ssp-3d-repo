const express = require("express");
const bcrypt = require("bcryptjs");
const { get, run } = require("../db/db");

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Login ---
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login", {
      title: "Login",
      error: "Please enter both username and password.",
    });
  }

  try {
    const user = await get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) {
      return res.render("login", {
        title: "Login",
        error: "Invalid username or password.",
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render("login", {
        title: "Login",
        error: "Invalid username or password.",
      });
    }

    req.session.user = { id: user.id, username: user.username, role: user.role };
    req.session.flash = "Welcome back, " + user.username + "!";
    res.redirect("/home");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
});

// --- Register ---
router.get("/register", (req, res) => {
  res.render("register", { title: "Register", error: null, old: {} });
});

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Server-side validation (FR3-B)
  if (!username || !email || !password || !confirmPassword) {
    return res.render("register", {
      title: "Register",
      error: "All fields are required.",
      old: req.body,
    });
  }
  if (username.length < 3) {
    return res.render("register", {
      title: "Register",
      error: "Username must be at least 3 characters.",
      old: req.body,
    });
  }
  if (!isValidEmail(email)) {
    return res.render("register", {
      title: "Register",
      error: "Please enter a valid email address.",
      old: req.body,
    });
  }
  if (password.length < 6) {
    return res.render("register", {
      title: "Register",
      error: "Password must be at least 6 characters.",
      old: req.body,
    });
  }
  if (password !== confirmPassword) {
    return res.render("register", {
      title: "Register",
      error: "Passwords do not match.",
      old: req.body,
    });
  }

  try {
    const existing = await get(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing) {
      return res.render("register", {
        title: "Register",
        error: "Username or email is already taken.",
        old: req.body,
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await run(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [username, email, hash]
    );

    req.session.flash = "Registration successful! Please log in.";
    res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Internal server error");
  }
});

// --- Logout ---
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

module.exports = router;
