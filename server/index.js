import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "../", process.env.DB_CA_CERT)),
  },
};

const initDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database successfully");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wishes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50),
        message TEXT NOT NULL,
        hidden TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration for wishes table
    try {
      await connection.execute(
        "ALTER TABLE wishes ADD COLUMN hidden BOOLEAN DEFAULT 0",
      );
    } catch (_) {}

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guest_name VARCHAR(255),
        path VARCHAR(100),
        event VARCHAR(100) NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration for new columns and features
    try {
      await connection.execute(
        "ALTER TABLE visitor_logs ADD COLUMN scroll_percent INT DEFAULT 0",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE visitor_logs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE visitor_logs ADD UNIQUE KEY guest_path (guest_name, path)",
      );
    } catch (_) {}

    await connection.end();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

app.get("/api/wishes", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM wishes WHERE hidden = 0 ORDER BY created_at DESC",
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wishes", async (req, res) => {
  const { name, phone, role, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO wishes (name, phone, role, message) VALUES (?, ?, ?, ?)",
      [name, phone, role, message],
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("Error inserting wish:", err.message);
    res.status(500).json({ error: "Error saving wish" });
  }
});

app.delete("/api/wishes/:id", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM wishes WHERE id = ?", [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wishes/bulk-delete", async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "IDs array is required" });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const placeholders = ids.map(() => "?").join(",");
    await connection.execute(
      `DELETE FROM wishes WHERE id IN (${placeholders})`,
      ids,
    );
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/wishes/:id/hide", async (req, res) => {
  const { hidden } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("UPDATE wishes SET hidden = ? WHERE id = ?", [
      hidden ? 1 : 0,
      req.params.id,
    ]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/wishes", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM wishes ORDER BY created_at DESC",
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/logs", async (req, res) => {
  const { guest_name, path: visitPath, event, scroll_percent } = req.body;
  const user_agent = req.headers["user-agent"];
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Use ON DUPLICATE KEY UPDATE so we merge logs by (guest_name, path)
    await connection.execute(
      `INSERT INTO visitor_logs 
       (guest_name, path, event, scroll_percent, user_agent) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       event = VALUES(event),
       scroll_percent = GREATEST(scroll_percent, VALUES(scroll_percent)),
       user_agent = VALUES(user_agent)`,
      [
        guest_name || null,
        visitPath || null,
        event,
        scroll_percent || 0,
        user_agent,
      ],
    );
    await connection.end();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/logs/bulk-delete", async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "IDs array is required" });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const placeholders = ids.map(() => "?").join(",");
    await connection.execute(
      `DELETE FROM visitor_logs WHERE id IN (${placeholders})`,
      ids,
    );
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM visitor_logs ORDER BY created_at DESC",
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await initDB();
  console.log(`Server running on port ${PORT}`);
});
