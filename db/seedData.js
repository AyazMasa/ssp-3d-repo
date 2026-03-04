const bcrypt = require("bcryptjs");
const { get, run } = require("./db");

/**
 * Auto-seed admin account and sample models when the database is empty.
 * Called on every server startup so Render's ephemeral disk never results
 * in an empty site.
 */
async function seedIfEmpty() {
  /* ── Admin account ─────────────────────────────────────── */
  const userCount = await get("SELECT COUNT(*) AS cnt FROM users");
  if (userCount.cnt === 0) {
    const hash = await bcrypt.hash("Admin123!", 10);
    await run(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
      ["admin", "admin@ssp.edu", hash, "admin"]
    );
    console.log("Seeded admin account  (admin / Admin123!)");
  }

  /* ── Sample models ─────────────────────────────────────── */
  const modelCount = await get("SELECT COUNT(*) AS cnt FROM models");
  if (modelCount.cnt === 0) {
    // Fetch the admin user id to set created_by
    const admin = await get("SELECT id FROM users WHERE username = 'admin'");
    const adminId = admin ? admin.id : null;

    const sampleModels = [
      {
        model_id: "MDL-0001",
        title: "3D Gear Assembly",
        author_name: "John Doe",
        author_email: "john@example.com",
        category: "Mechanical",
        format: "STL",
        file_link: "https://example.com/models/gear.stl",
        visibility_status: "Public",
      },
      {
        model_id: "MDL-0002",
        title: "Drone Frame v2",
        author_name: "Sarah Connor",
        author_email: "sarah@example.com",
        category: "Aerospace",
        format: "OBJ",
        file_link: "https://example.com/models/drone.obj",
        visibility_status: "Public",
      },
      {
        model_id: "MDL-0003",
        title: "Robotic Arm Prototype",
        author_name: "Alan Turing",
        author_email: "alan@example.com",
        category: "Robotics",
        format: "STEP",
        file_link: "https://example.com/models/arm.step",
        visibility_status: "Public",
      },
      {
        model_id: "MDL-0004",
        title: "Architectural Floor Plan",
        author_name: "Zaha Hadid",
        author_email: "zaha@example.com",
        category: "Architecture",
        format: "DWG",
        file_link: "https://example.com/models/floor.dwg",
        visibility_status: "Private",
      },
    ];

    for (const m of sampleModels) {
      await run(
        `INSERT INTO models
           (model_id, title, author_name, author_email, category, format, file_link, visibility_status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.model_id, m.title, m.author_name, m.author_email, m.category, m.format, m.file_link, m.visibility_status, adminId]
      );
    }
    console.log(`Seeded ${sampleModels.length} sample models`);
  }
}

module.exports = { seedIfEmpty };
