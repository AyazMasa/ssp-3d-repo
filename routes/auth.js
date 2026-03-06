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

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        return res.status(500).send("Internal server error");
      }
      req.session.user = { id: user.id, username: user.username, role: user.role };
      req.session.flash = "Welcome back, " + user.username + "!";
      res.redirect("/home");
    });
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
      old: { username, email },
    });
  }
  if (username.length < 3) {
    return res.render("register", {
      title: "Register",
      error: "Username must be at least 3 characters.",
      old: { username, email },
    });
  }
  if (!isValidEmail(email)) {
    return res.render("register", {
      title: "Register",
      error: "Please enter a valid email address.",
      old: { username, email },
    });
  }
  if (password.length < 6) {
    return res.render("register", {
      title: "Register",
      error: "Password must be at least 6 characters.",
      old: { username, email },
    });
  }
  if (password !== confirmPassword) {
    return res.render("register", {
      title: "Register",
      error: "Passwords do not match.",
      old: { username, email },
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
        old: { username, email },
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

// --- Logout (POST to prevent CSRF) ---
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

// GET /logout also supported for convenience
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

module.exports = router;
