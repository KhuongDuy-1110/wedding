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
    // 1. Check for certificate content in environment variable
    if (process.env.DB_CA_CERT_CONTENT) {
      return { ca: process.env.DB_CA_CERT_CONTENT, rejectUnauthorized: true };
    }

    // 2. Fallback to file path
    if (process.env.DB_CA_CERT) {
      // Try multiple potential paths
      const potentialPaths = [
        path.join(process.cwd(), process.env.DB_CA_CERT), // Root relative
        path.join(__dirname, "../", process.env.DB_CA_CERT), // Module relative
        path.resolve(process.env.DB_CA_CERT), // Absolute or cwd relative
      ];

      for (const certPath of potentialPaths) {
        if (fs.existsSync(certPath)) {
          try {
            const certData = fs.readFileSync(certPath);
            return { ca: certData, rejectUnauthorized: true };
          } catch (readErr) {
            console.error(
              `Error reading cert at ${certPath}:`,
              readErr.message,
            );
          }
        }
      }

      console.warn(
        "No DB_CA_CERT file found in checked paths. Proceeding with caution.",
      );
    }

    // 3. If DB_SSL is true but no cert found, at least enable SSL with rejection (Aiven requires it)
    if (
      process.env.DB_SSL === "true" ||
      process.env.NODE_ENV === "production"
    ) {
      return { rejectUnauthorized: true };
    }
  } catch (err) {
    console.error("SSL Config error:", err.message);
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
  // --- Nhóm từ thô tục gốc & Bộ phận cơ thể ---
  "địt",
  "đụ",
  "lồn",
  "cặc",
  "buồi",
  "vú",
  "đít",
  "dâm",
  "nứng",
  "tiệt",
  "hãm",
  "chịch",
  "xoạc",
  "nện",
  "phang",
  "phập",
  "mâm",
  "thú tính",
  "giao cấu",
  "bướm",
  "cu",
  "khoai",
  "bi",
  "bì",
  "háng",
  "mông",
  "âm hộ",
  "dương vật",
  "tinh trùng",
  "xuất tinh",
  "thẩm du",
  "quay tay",
  "sục cặc",
  "bú cu",
  "bú lồn",
  "móc lốp",

  // --- Nhóm viết tắt & Teencode lách luật ---
  "đm",
  "dm",
  "đkm",
  "dkv",
  "dcm",
  "dct",
  "vcl",
  "vkl",
  "vl",
  "vch",
  "vcl",
  "vnd",
  "cmn",
  "clgt",
  "tđn",
  "đéo",
  "deo",
  "đé0",
  "dmm",
  "đmm",
  "cl",
  "cc",
  "loz",
  "lìn",
  "lờ",
  "bòi",
  "cẹc",
  "kẹc",
  "pắt",
  "đýt",
  "đýt",
  "đjt",
  "đjyt",
  "đyt",
  "đệch",
  "đệt",
  "đệt",
  "đcmm",
  "đm m",
  "đ m",
  "v l",
  "v lz",
  "v lờ",

  // --- Nhóm biến thể âm tiết & Ký tự đặc biệt ---
  "duma",
  "dume",
  "đumá",
  "đumẹ",
  "đ.m",
  "v.l",
  "v_l",
  "l0n",
  "c@c",
  "b.u.o.i",
  "đ.é.o",
  "đờ mờ",
  "vê lờ",
  "vãi lờ",
  "vãi lúa",
  "vãi chưởng",
  "vãi nồi",
  "đê ca mờ",
  "đm-",
  "vcl-",
  "cl-",
  "d.m",
  "d-m",
  "d_m",
  "v-l",
  "v_l",

  // --- Nhóm miệt thị, xúc phạm & Chửi bới ---
  "ngu",
  "óc chó",
  "óc lợn",
  "ngu lồn",
  "thằng chó",
  "con chó",
  "đồ chó",
  "súc vật",
  "thiểu năng",
  "đần",
  "đần độn",
  "vô học",
  "thất học",
  "rác rưởi",
  "đồ hèn",
  "điếm",
  "phò",
  "đĩ",
  "con giáp",
  "phản phúc",
  "mặt dày",
  "khốn nạn",
  "khốn kiếp",
  "xạo lồn",
  "xl",
  "hãm lồn",
  "hãm tài",
  "cút",
  "mẹ mày",
  "cha mày",
  "tiên sư",

  // --- Nhóm phân biệt vùng miền & Nhạy cảm ---
  "bắc kỳ",
  "nam kỳ",
  "trung kỳ",
  "parky",
  "bake",
  "nuke",
  "tnt",
  "mọi",
  "mọi miên",
  "phản động",
  "ngụy",
  "tộc",
  "mường",
  "mèo",
  "mán",
  "thanh nghệ tĩnh",
  "bần nông",

  // --- Nhóm từ lóng Gen Z & Từ mới ---
  "cái nịt",
  "xà lơ",
  "bủh",
  "dảk",
  "atsm",
  "trẻ trâu",
  "sửu nhi",
  "ngáo",
  "ngáo đá",
  "đào mỏ",
  "đào lửa",
  "lùa gà",
  "phông bạt",
  "cứt",
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
        "ALTER TABLE visitor_logs ADD COLUMN visitor_id VARCHAR(100)",
      );
    } catch (_) {}
    try {
      // Drop old unique key if it exists
      await connection.execute(
        "ALTER TABLE visitor_logs DROP INDEX guest_path",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE visitor_logs ADD UNIQUE KEY visitor_path (visitor_id, path)",
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
    res.status(201).json({
      id: result.insertId,
      ...req.body,
      hidden,
      flagged,
      guest_path_name: pathName,
    });
  } catch (err) {
    console.error("Error inserting wish:", err.message);
    res.status(500).json({ error: "Error saving wish" });
  }
});

app.delete("/api/wishes/:id", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM wishes WHERE id = ?", [
      req.params.id,
    ]);
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
  const {
    visitor_id,
    guest_name,
    path: visitPath,
    event,
    scroll_percent,
  } = req.body;
  const user_agent = req.headers["user-agent"];

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Calculate new flags
    const isAddingVisit = event === "page_visit" ? 1 : 0;
    const isOpening = event === "open_invitation" ? 1 : 0;
    const isViewingQR = event === "view_qr" ? 1 : 0;

    // Use INSERT ... ON DUPLICATE KEY for flags and counts
    // Update guest_name if it was null before but is provided now
    await connection.execute(
      `INSERT INTO visitor_logs 
       (visitor_id, guest_name, path, event, scroll_percent, visit_count, is_opened, is_qr_viewed, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       guest_name = IFNULL(guest_name, VALUES(guest_name)),
       visit_count = visit_count + VALUES(visit_count),
       is_opened = GREATEST(is_opened, VALUES(is_opened)),
       is_qr_viewed = GREATEST(is_qr_viewed, VALUES(is_qr_viewed)),
       scroll_percent = GREATEST(scroll_percent, VALUES(scroll_percent)),
       user_agent = VALUES(user_agent)`,
      [
        visitor_id || null,
        guest_name || null,
        visitPath || null,
        event,
        scroll_percent || 0,
        isAddingVisit,
        isOpening,
        isViewingQR,
        user_agent,
      ],
    );

    // Update the 'event' display string only if the new event is 'higher'
    await connection.execute(
      `
      UPDATE visitor_logs 
      SET event = ? 
      WHERE visitor_id = ? AND path = ? AND (
        CASE 
          WHEN ? = 'view_qr' THEN 1
          WHEN ? = 'scroll_depth' AND event != 'view_qr' THEN 1
          WHEN ? = 'open_invitation' AND event NOT IN ('view_qr', 'scroll_depth', 'send_wish') THEN 1
          WHEN ? = 'page_visit' AND event = 'page_visit' THEN 1
          ELSE 0
        END = 1
      )
    `,
      [
        event,
        visitor_id || null,
        visitPath || null,
        event,
        event,
        event,
        event,
      ],
    );

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
    res
      .status(404)
      .json({ error: "Frontend build not found. Run 'yarn build' first." });
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
  // In production (Vercel/Cloud), initialize DB without app.listen()
  initDB().catch((err) =>
    console.error("Database initialization failed:", err),
  );
}
