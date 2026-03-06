const express = require("express");
const path = require("path");
const router = express.Router();

const { all } = require("../db/db");
const { requireLogin } = require("./middleware");
const SaxonJS = require("saxon-js");

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function buildModelsXml(user) {
  let models;
  if (user && user.role === 'admin') {
    models = await all("SELECT * FROM models ORDER BY id DESC");
  } else if (user) {
    models = await all(
      "SELECT * FROM models WHERE visibility_status = 'Public' OR created_by = ? ORDER BY id DESC",
      [user.id]
    );
  } else {
    models = await all("SELECT * FROM models WHERE visibility_status = 'Public' ORDER BY id DESC");
  }
  const generatedAt = new Date().toISOString();

  const itemsXml = models
    .map((m) => `
  <model>
    <id>${escapeXml(m.id)}</id>
    <model_id>${escapeXml(m.model_id)}</model_id>
    <title>${escapeXml(m.title)}</title>
    <author_name>${escapeXml(m.author_name)}</author_name>
    <author_email>${escapeXml(m.author_email)}</author_email>
    <category>${escapeXml(m.category)}</category>
    <format>${escapeXml(m.format)}</format>
    <file_link>${escapeXml(m.file_link)}</file_link>
    <visibility_status>${escapeXml(m.visibility_status)}</visibility_status>
    <created_at>${escapeXml(m.created_at)}</created_at>
  </model>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<models generatedAt="${generatedAt}">
${itemsXml}
</models>`;

  return { xml };
}

// 1) Export XML file (and show it in browser)
router.get("/report/xml", requireLogin, async (req, res) => {
  try {
    const { xml } = await buildModelsXml(req.session.user);
    res.type("application/xml").send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send("Report XML error");
  }
});

// 2) Report landing page (renders template with embedded iframe)
router.get("/report", requireLogin, (req, res) => {
  res.render("report", { title: "Report" });
});

// 3) Transform XML -> HTML via Saxon-JS (used by iframe)
router.get("/report/html", requireLogin, async (req, res) => {
  try {
    const { xml } = await buildModelsXml(req.session.user);

    const sefPath = path.join(__dirname, "..", "xml", "models.sef.json");

    const result = SaxonJS.transform(
      {
        stylesheetFileName: sefPath,
        sourceText: xml,
        destination: "serialized",
      },
      "sync"
    );

    const html = result.principalResult;
    res.type("text/html").send(html);
  } catch (err) {
    console.error("REPORT TRANSFORM ERROR:", err);
    res.status(500).send("Report transform error");
  }
});

module.exports = router;
