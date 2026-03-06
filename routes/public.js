const express = require("express");
const router = express.Router();

router.get(["/", "/home"], (req, res) => res.render("home", { title: "Home" }));
router.get("/about", (req, res) => res.render("about", { title: "About" }));
router.get("/contact", (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const siteUrl = `${protocol}://${host}`;
  res.render("contact", { title: "Contact", sent: req.query.sent === '1', siteUrl });
});

module.exports = router;
