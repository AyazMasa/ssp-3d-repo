const express = require("express");
const bcrypt = require("bcryptjs");
const { all, get, run } = require("../db/db");
const { requireAdmin } = require("./middleware");

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// LIST
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await all(
      "SELECT id, username, email, role, created_at FROM users ORDER BY id DESC"
    );
    res.render("users/index", { title: "Users", users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// NEW FORM
router.get("/new", requireAdmin, (req, res) => {
  res.render("users/new", { title: "Add User", error: null, old: {} });
});

// CREATE
router.post("/", requireAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.render("users/new", {
      title: "Add User",
      error: "All fields are required.",
      old: req.body,
    });
  }
  if (!isValidEmail(email)) {
    return res.render("users/new", {
      title: "Add User",
      error: "Invalid email format.",
      old: req.body,
    });
  }
  if (!["admin", "user"].includes(role)) {
    return res.render("users/new", {
      title: "Add User",
      error: "Invalid role.",
      old: req.body,
    });
  }
  if (password.length < 6) {
    return res.render("users/new", {
      title: "Add User",
      error: "Password must be at least 6 characters.",
      old: req.body,
    });
  }

  try {
    const existing = await get(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing) {
      return res.render("users/new", {
        title: "Add User",
        error: "Username or email already exists.",
        old: req.body,
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await run(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [username, email, hash, role]
    );

    req.session.flash = "User created successfully.";
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// VIEW DETAILS
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const userRecord = await get(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    if (!userRecord) return res.status(404).send("User not found");
    res.render("users/show", { title: "User Details", userRecord });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// EDIT FORM
router.get("/:id/edit", requireAdmin, async (req, res) => {
  try {
    const userRecord = await get(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.params.id]
    );
    if (!userRecord) return res.status(404).send("User not found");
    res.render("users/edit", { title: "Edit User", userRecord, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// UPDATE
router.post("/:id", requireAdmin, async (req, res) => {
  const { username, email, role } = req.body;

  if (!username || !email || !role) {
    const userRecord = await get(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.params.id]
    );
    return res.render("users/edit", {
      title: "Edit User",
      userRecord: { ...userRecord, ...req.body },
      error: "All fields are required.",
    });
  }
  if (!isValidEmail(email)) {
    const userRecord = await get(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.params.id]
    );
    return res.render("users/edit", {
      title: "Edit User",
      userRecord: { ...userRecord, ...req.body },
      error: "Invalid email format.",
    });
  }
  if (!["admin", "user"].includes(role)) {
    const userRecord = await get(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.params.id]
    );
    return res.render("users/edit", {
      title: "Edit User",
      userRecord: { ...userRecord, ...req.body },
      error: "Invalid role.",
    });
  }

  try {
    const dup = await get(
      "SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?",
      [username, email, req.params.id]
    );
    if (dup) {
      const userRecord = await get(
        "SELECT id, username, email, role FROM users WHERE id = ?",
        [req.params.id]
      );
      return res.render("users/edit", {
        title: "Edit User",
        userRecord: { ...userRecord, ...req.body },
        error: "Username or email already exists.",
      });
    }

    await run("UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?", [
      username,
      email,
      role,
      req.params.id,
    ]);

    req.session.flash = "User updated successfully.";
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// DELETE
router.post("/:id/delete", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (req.session.user && req.session.user.id === id) {
    req.session.flash = "You cannot delete your own account.";
    return res.redirect("/users");
  }

  try {
    await run("DELETE FROM users WHERE id = ?", [id]);
    req.session.flash = "User deleted successfully.";
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

module.exports = router;
