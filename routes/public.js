const express = require("express");
const router = express.Router();

router.get(["/", "/home"], (req, res) => res.render("home", { title: "Home" }));
router.get("/about", (req, res) => res.render("about", { title: "About" }));
router.get("/contact", (req, res) => res.render("contact", { title: "Contact" }));

module.exports = router;
