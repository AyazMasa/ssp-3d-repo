const bcrypt = require("bcryptjs");
const { initDb, get, run } = require("./db");

async function seed() {
  await initDb();

  const row = await get("SELECT COUNT(*) AS cnt FROM users");
  if (row.cnt > 0) {
    console.log("Users already exist — skipping admin seed.");
    return process.exit(0);
  }

  const username = "admin";
  const email = "admin@ssp.edu";
  const password = "Admin123!";
  const hash = await bcrypt.hash(password, 10);

  await run(
    "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [username, email, hash, "admin"]
  );

  console.log("Admin account created:");
  console.log("  Username:", username);
  console.log("  Password:", password);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
