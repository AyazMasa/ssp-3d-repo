const path = require("path");
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const { initDb } = require("./db/db");
const { seedIfEmpty } = require("./db/seedData");

const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const modelRoutes = require("./routes/models");
const reportRoutes = require("./routes/report");
const usersRoutes = require("./routes/users");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: path.join(__dirname, "db") }),
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production" && false,   // set true only if using HTTPS proxy
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,  // 24 hours
    },
  })
);

// Flash messages + auth state available in all templates
app.use((req, res, next) => {
  // Clear stale sessions from before auth upgrade
  if (req.session.user && !req.session.user.role) {
    delete req.session.user;
  }
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

app.use("/", publicRoutes);
app.use("/", authRoutes);
app.use("/models", modelRoutes);
app.use("/", reportRoutes);
app.use("/users", usersRoutes);

app.get("/healthz", (req, res) => res.status(200).send("ok"));

app.use((req, res) => res.status(404).render("404", { title: "Page Not Found" }));

initDb()
  .then(() => seedIfEmpty())
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
