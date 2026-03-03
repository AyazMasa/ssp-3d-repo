const express = require("express");
const router = express.Router();
const { all, run, get } = require("../db/db");
const { requireLogin } = require("./middleware");

router.get("/", requireLogin, async (req, res) => {
  try {
    const search = req.query.search || "";

    let models;

    if (search) {
      models = await all(
        `SELECT * FROM models
         WHERE model_id LIKE ?
            OR title LIKE ?
            OR author_name LIKE ?
            OR category LIKE ?
         ORDER BY id DESC`,
        [
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
        ]
      );
    } else {
      models = await all("SELECT * FROM models ORDER BY id DESC");
    }

    res.render("models/index", {
      title: "Models",
      models,
      search,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get("/new", requireLogin, (req, res) => {
  res.render("models/new", { title: "Add Model", error: null, old: {} });
});

router.post("/new", requireLogin, async (req, res) => {
  const {
    model_id,
    title,
    author_name,
    author_email,
    category,
    format,
    file_link,
    visibility_status,
  } = req.body;

  // Server-side validation (required)
  if (!model_id || !title || !author_name || !author_email || !category || !format || !file_link) {
    return res.render("models/new", {
      title: "Add Model",
      error: "Please fill all required fields.",
      old: req.body,
    });
  }

  // Simple email format check (server-side)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email);
  if (!emailOk) {
    return res.render("models/new", {
      title: "Add Model",
      error: "Invalid email format.",
      old: req.body,
    });
  }

  try {
    // Duplicate model_id check
    const existing = await get("SELECT id FROM models WHERE model_id = ?", [model_id]);
    if (existing) {
      return res.render("models/new", {
        title: "Add Model",
        error: "Model ID already exists.",
        old: req.body,
      });
    }

    await run(
      `INSERT INTO models
       (model_id, title, author_name, author_email, category, format, file_link, visibility_status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model_id,
        title,
        author_name,
        author_email,
        category,
        format,
        file_link,
        visibility_status || "Public",
        req.session.user.id,
      ]
    );

    req.session.flash = "Model added successfully.";
    return res.redirect("/models");
  } catch (err) {
    console.error("CREATE MODEL ERROR:", err);
    return res.status(500).send("Database error");
  }
});

router.get("/:id/edit", requireLogin, async (req, res) => {
  const model = await get("SELECT * FROM models WHERE id = ?", [req.params.id]);
  if (!model) return res.status(404).send("Not found");

  // Only the owner or an admin can edit
  if (model.created_by !== req.session.user.id && req.session.user.role !== "admin") {
    req.session.flash = "You can only edit models you created.";
    return res.redirect("/models");
  }

  res.render("models/edit", { title: "Edit Model", model, error: null });
});

router.post("/:id/edit", requireLogin, async (req, res) => {
  // Ownership check
  const existing = await get("SELECT * FROM models WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).send("Not found");
  if (existing.created_by !== req.session.user.id && req.session.user.role !== "admin") {
    req.session.flash = "You can only edit models you created.";
    return res.redirect("/models");
  }

  const {
    title,
    author_name,
    author_email,
    category,
    format,
    file_link,
    visibility_status,
  } = req.body;

  if (!title || !author_name || !author_email || !category || !format || !file_link) {
    const model = await get("SELECT * FROM models WHERE id = ?", [req.params.id]);
    return res.render("models/edit", { title: "Edit Model", model, error: "All fields required." });
  }

  await run(
    `UPDATE models
     SET title=?, author_name=?, author_email=?, category=?, format=?, file_link=?, visibility_status=?
     WHERE id=?`,
    [
      title,
      author_name,
      author_email,
      category,
      format,
      file_link,
      visibility_status,
      req.params.id,
    ]
  );

  req.session.flash = "Model updated.";
  res.redirect("/models");
});

router.get("/:id", requireLogin, async (req, res) => {
  try {
    const model = await get(
      `SELECT models.*, users.username AS owner_name
       FROM models LEFT JOIN users ON models.created_by = users.id
       WHERE models.id = ?`,
      [req.params.id]
    );

    if (!model) return res.status(404).send("Model not found");

    res.render("models/view", { title: "Model Details", model });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.post("/:id/delete", requireLogin, async (req, res) => {
  try {
    // Ownership check: only owner or admin can delete
    const model = await get("SELECT * FROM models WHERE id = ?", [req.params.id]);
    if (!model) return res.status(404).send("Model not found");
    if (model.created_by !== req.session.user.id && req.session.user.role !== "admin") {
      req.session.flash = "You can only delete models you created.";
      return res.redirect("/models");
    }

    await run("DELETE FROM models WHERE id = ?", [req.params.id]);
    req.session.flash = "Model deleted.";
    res.redirect("/models");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

module.exports = router;
