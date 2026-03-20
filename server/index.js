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

// Serve static files from the frontend build directory
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

const getSSLConfig = () => {
  try {
    if (process.env.DB_CA_CERT_CONTENT) {
      return { ca: process.env.DB_CA_CERT_CONTENT };
    }
    
    if (process.env.DB_CA_CERT) {
      const certPath = path.join(__dirname, "../", process.env.DB_CA_CERT);
      if (fs.existsSync(certPath)) {
        return { ca: fs.readFileSync(certPath) };
      }
    }
  } catch (err) {
    console.error("SSL Config error, proceeding without SSL if possible:", err.message);
  }
  return null;
};

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: getSSLConfig(),
};

const blacklist = [
  "địt", "đụ", "lồn", "cặc", "buồi", "vú", "đít", "dâm", "thú tính",
  "đệt", "đêý", "cẹc", "bòi", "lìn", "lờ", "nứng", "chịch", "xoạc", "nện", "phang",
  "đm", "đkm", "dcm", "vcl", "vkl", "vl", "vch", "cmn", "clgt", "tđn", "đéo", "đé0",
  "duma", "dume", "dcmm", "đ.m", "v.l", "l0n", "c@c", "b.u.o.i",
  "đê ca mờ", "đờ mờ", "vê lờ", "vãi chưởng", "vãi lúa", "vãi nồi",
  "ngu", "đần", "óc chó", "óc lợn", "thiểu năng", "vô học", "thất học", "súc vật",
  "đĩ", "phò", "điếm", "con giáp", "mặt dày", "khốn nạn", "khốn kiếp", " đồ chó",
  "xạo lồn", "xl", "bốc phét", "hãm lồn", "hãm tài", "rác rưởi",
  "bắc kỳ", "nam kỳ", "parky", "bake"
];

const checkBlacklist = (text = "") => {
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  return blacklist.some((word) => {
    const wordNoSpace = word.toLowerCase().replace(/\s+/g, "");
    return normalized.includes(wordNoSpace);
  });
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
        flagged TINYINT(1) DEFAULT 0,
        guest_path_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration for wishes table
    try {
      await connection.execute(
        "ALTER TABLE wishes ADD COLUMN hidden BOOLEAN DEFAULT 0",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE wishes ADD COLUMN flagged BOOLEAN DEFAULT 0",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE wishes ADD COLUMN guest_path_name VARCHAR(255)",
      );
    } catch (_) {}

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guest_name VARCHAR(255),
        path VARCHAR(100),
        event VARCHAR(100) NOT NULL,
        scroll_percent INT DEFAULT 0,
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
        "ALTER TABLE visitor_logs ADD COLUMN visit_count INT DEFAULT 1",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE visitor_logs ADD COLUMN is_opened TINYINT(1) DEFAULT 0",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE visitor_logs ADD COLUMN is_qr_viewed TINYINT(1) DEFAULT 0",
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
  const { name, phone, role, message, guest_path_name } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  const isFlagged = checkBlacklist(name) || checkBlacklist(message);
  const hidden = isFlagged ? 1 : 0;
  const flagged = isFlagged ? 1 : 0;
  const pathName = guest_path_name || "Không xác định";

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO wishes (name, phone, role, message, hidden, flagged, guest_path_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, phone, role, message, hidden, flagged, pathName],
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, ...req.body, hidden, flagged, guest_path_name: pathName });
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

  // Define event weights for "not overwriting backwards"
  const eventWeights = {
    page_visit: 1,
    open_invitation: 2,
    scroll_depth: 3,
    view_qr: 4
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Calculate new flags
    const isAddingVisit = event === "page_visit" ? 1 : 0;
    const isOpening = event === "open_invitation" ? 1 : 0;
    const isViewingQR = event === "view_qr" ? 1 : 0;

    // Use INSERT ... ON DUPLICATE KEY for flags and counts
    await connection.execute(
      `INSERT INTO visitor_logs 
       (guest_name, path, event, scroll_percent, visit_count, is_opened, is_qr_viewed, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       visit_count = visit_count + VALUES(visit_count),
       is_opened = GREATEST(is_opened, VALUES(is_opened)),
       is_qr_viewed = GREATEST(is_qr_viewed, VALUES(is_qr_viewed)),
       scroll_percent = GREATEST(scroll_percent, VALUES(scroll_percent)),
       user_agent = VALUES(user_agent)`,
      [
        guest_name || null,
        visitPath || null,
        event,
        scroll_percent || 0,
        isAddingVisit,
        isOpening,
        isViewingQR,
        user_agent,
      ]
    );

    // Update the 'event' display string only if the new event is 'higher' 
    // This avoids "going backwards" from QR -> visit
    await connection.execute(`
      UPDATE visitor_logs 
      SET event = ? 
      WHERE guest_name = ? AND path = ? AND (
        CASE 
          WHEN ? = 'view_qr' THEN 1
          WHEN ? = 'scroll_depth' AND event != 'view_qr' THEN 1
          WHEN ? = 'open_invitation' AND event NOT IN ('view_qr', 'scroll_depth', 'send_wish') THEN 1
          WHEN ? = 'page_visit' AND event = 'page_visit' THEN 1
          ELSE 0
        END = 1
      )
    `, [
      event, 
      guest_name || null, 
      visitPath || null, 
      event, event, event, event
    ]);

    await connection.end();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Log error:", err.message);
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

// SPA Fallback: All other GET requests serve index.html
app.use((req, res) => {
  if (fs.existsSync(path.join(distPath, "index.html"))) {
    res.sendFile(path.join(distPath, "index.html"));
  } else {
    res.status(404).json({ error: "Frontend build not found. Run 'yarn build' first." });
  }
});

// Export the app for Vercel serverless functions
export default app;

const PORT = process.env.PORT || 3001;

// Only start the server if not running on Vercel (standard Node environment)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    try {
      await initDB();
      console.log(`Server running on port ${PORT}`);
    } catch (err) {
      console.error("Failed to init DB:", err);
    }
  });
} else {
  // In production (Vercel), we still need to ensure DB is initialized
  // but we don't call app.listen()
  initDB().catch(err => console.error("Production DB init failed:", err));
}
