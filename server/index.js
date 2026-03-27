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

const wishRateMap = new Map();
const WISH_COOLDOWN_MS = 60000;
const MAX_WISHES_PER_IP = 5;
const MAX_NAME_LENGTH = 25;
const MAX_MESSAGE_LENGTH = 150;

// Note: Static files and other routes will be defined later in order of priority

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
  port: Number(process.env.DB_PORT),
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

const generateShortId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
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
    try {
      await connection.execute(
        "ALTER TABLE wishes ADD COLUMN visitor_id VARCHAR(100)",
      );
    } catch (_) {}
    try {
      await connection.execute(
        "ALTER TABLE wishes ADD COLUMN invitation_id VARCHAR(10)",
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
      await connection.execute("ALTER TABLE visitor_logs ADD COLUMN scroll_percent INT DEFAULT 0");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs ADD COLUMN visit_count INT DEFAULT 1");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs ADD COLUMN is_opened TINYINT(1) DEFAULT 0");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs ADD COLUMN is_qr_viewed TINYINT(1) DEFAULT 0");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs ADD COLUMN visitor_id VARCHAR(100)");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs DROP INDEX guest_path");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE visitor_logs ADD UNIQUE KEY visitor_path (visitor_id, path)");
    } catch (_) {}

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key_name VARCHAR(255) PRIMARY KEY,
        value_content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS invitations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        short_id VARCHAR(10) UNIQUE,
        name VARCHAR(255) NOT NULL,
        side VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rsvp (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invitation_id VARCHAR(10),
        name VARCHAR(255),
        count INT DEFAULT 1,
        side VARCHAR(50),
        status VARCHAR(50),
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration for short_id & is_sent
    try {
      await connection.execute("ALTER TABLE invitations ADD COLUMN short_id VARCHAR(10) UNIQUE AFTER id");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE invitations ADD COLUMN is_sent BOOLEAN DEFAULT 0 AFTER side");
    } catch (_) {}
    try {
      await connection.execute("ALTER TABLE invitations ADD COLUMN template_type VARCHAR(50) DEFAULT 'bạn' AFTER name");
    } catch (_) {}

    // Initial settings for images if table is empty
    const [settings] = await connection.execute("SELECT COUNT(*) as count FROM site_settings");
    if (settings[0].count === 0) {
      const defaultSettings = [
        ['hero_bg', '/assets/hero.png'],
        ['hero_couple', '/assets/couple.png'],
        ['bride_main', 'https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg'],
        ['bride_small_1', 'https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg'],
        ['bride_small_2', 'https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg'],
        ['groom_main', 'https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg'],
        ['groom_small_1', 'https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg'],
        ['groom_small_2', 'https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg'],
        ['gallery_list', JSON.stringify(['/assets/gallery-1.png', '/assets/trai-tim.jpg', '/assets/couple.png'])],
        ['invitation_template_groom', 'Trân trọng kính mời [name] tới dự lễ cưới của chúng mình tại [link] !'],
        ['invitation_template_bride', 'Trân trọng kính mời [name] tới dự lễ ăn hỏi & tiệc mừng của chúng mình tại [link] !'],
      ];
      
      for (const [key, val] of defaultSettings) {
        await connection.execute("INSERT INTO site_settings (key_name, value_content) VALUES (?, ?)", [key, val]);
      }
    }

    await connection.end();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

// Site Settings APIs
app.get("/api/settings", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM site_settings");
    await connection.end();
    
    // Transform to object for easier use on frontend
    const settings = rows.reduce((acc, row) => {
      acc[row.key_name] = row.value_content;
      return acc;
    }, {});
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/settings", async (req, res) => {
  const { key_name, value_content } = req.body;
  if (!key_name || value_content === undefined) {
    return res.status(400).json({ error: "Key and value are required" });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "INSERT INTO site_settings (key_name, value_content) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_content = ?",
      [key_name, value_content, value_content]
    );
    await connection.end();
    res.json({ success: true, key_name, value_content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/wishes", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, name, role, message, guest_path_name, visitor_id, invitation_id, created_at FROM wishes WHERE hidden = 0 ORDER BY created_at DESC",
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wishes", async (req, res) => {
  const { name, phone, role, message, guest_path_name, visitor_id, invitation_id } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return res.status(400).json({ error: `Tên không được vượt quá ${MAX_NAME_LENGTH} ký tự` });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Lời chúc không được vượt quá ${MAX_MESSAGE_LENGTH} ký tự` });
  }

  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const rateData = wishRateMap.get(clientIp) || { count: 0, lastTime: 0 };

  if (now - rateData.lastTime < WISH_COOLDOWN_MS) {
    const remaining = Math.ceil((WISH_COOLDOWN_MS - (now - rateData.lastTime)) / 1000);
    return res.status(429).json({ error: `Vui lòng chờ ${remaining} giây trước khi gửi lời chúc tiếp` });
  }

  if (rateData.count >= MAX_WISHES_PER_IP) {
    return res.status(429).json({ error: "Bạn đã gửi đủ số lời chúc cho phép. Cảm ơn bạn!" });
  }

  const isFlagged = checkBlacklist(name) || checkBlacklist(message);
  const hidden = isFlagged ? 1 : 0;
  const flagged = isFlagged ? 1 : 0;
  const pathName = guest_path_name || "Không xác định";

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO wishes (name, phone, role, message, hidden, flagged, guest_path_name, visitor_id, invitation_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, phone, role, message, hidden, flagged, pathName, visitor_id || null, invitation_id || null],
    );
    await connection.end();

    wishRateMap.set(clientIp, { count: rateData.count + 1, lastTime: now });

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

app.post("/api/rsvp", async (req, res) => {
  const { invitation_id, name, count, side, status, note } = req.body;
  if (!name || !status) {
    return res.status(400).json({ error: "Name and status are required" });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO rsvp (invitation_id, name, count, side, status, note) VALUES (?, ?, ?, ?, ?, ?)",
      [invitation_id || null, name, count || 1, side || 'both', status, note || '']
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/rsvp/status/:shortId", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT status, name, count, created_at FROM rsvp WHERE invitation_id = ? ORDER BY created_at DESC LIMIT 1",
      [req.params.shortId]
    );
    await connection.end();
    if (rows.length > 0) {
      res.json({ hasResponded: true, ...rows[0] });
    } else {
      res.json({ hasResponded: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/rsvp", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM rsvp ORDER BY created_at DESC");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/wishes/:id/recall", async (req, res) => {
  const { visitor_id, invitation_id } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "DELETE FROM wishes WHERE id = ? AND (visitor_id = ? OR (invitation_id = ? AND invitation_id IS NOT NULL))",
      [req.params.id, visitor_id, invitation_id]
    );
    await connection.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lời chúc không tồn tại hoặc không thể thu hồi" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/wishes/:id", async (req, res) => {
  const { message, visitor_id, invitation_id } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE wishes SET message = ? WHERE id = ? AND (visitor_id = ? OR (invitation_id = ? AND invitation_id IS NOT NULL))",
      [message, req.params.id, visitor_id, invitation_id]
    );
    await connection.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy lời chúc để chỉnh sửa" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

app.get("/api/invitations", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Get all invitations with their latest RSVP status
    const [rows] = await connection.execute(`
      SELECT
        i.id, i.short_id, i.name, i.template_type, i.side, i.is_sent, i.created_at,
        r.status as rsvp_status,
        r.count as rsvp_count,
        r.note as rsvp_note,
        r.created_at as rsvp_at
      FROM invitations i
      LEFT JOIN (
        SELECT r1.* FROM rsvp r1
        INNER JOIN (
          SELECT MAX(id) as max_id FROM rsvp GROUP BY invitation_id, name
        ) r2 ON r1.id = r2.max_id
      ) r ON (i.short_id = r.invitation_id OR i.name = r.name)
      ORDER BY i.created_at DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error("SQL Error in /api/invitations:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/invitations", async (req, res) => {
  const { name, side, template_type } = req.body;
  if (!name || !side) return res.status(400).json({ error: "Name and side are required" });
  const shortId = generateShortId();
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute("INSERT INTO invitations (short_id, name, side, template_type) VALUES (?, ?, ?, ?)", [shortId, name, side, template_type || 'bạn']);
    await connection.end();
    res.status(201).json({ id: result.insertId, short_id: shortId, name, side, template_type: template_type || 'bạn' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/invitations/bulk", async (req, res) => {
  const { guests } = req.body;
  if (!guests || !Array.isArray(guests)) return res.status(400).json({ error: "Guests array required" });
  try {
    const connection = await mysql.createConnection(dbConfig);
    const values = guests.map(g => [generateShortId(), g.name, g.side, g.template_type || 'bạn']);
    // Use .query instead of .execute for bulk inserts with arrays of arrays
    await connection.query("INSERT INTO invitations (short_id, name, side, template_type) VALUES ?", [values]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/invitations/:id", async (req, res) => {
  const { name, template_type } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    if (name && template_type) {
      await connection.execute("UPDATE invitations SET name = ?, template_type = ? WHERE id = ?", [name, template_type, req.params.id]);
    } else if (name) {
      await connection.execute("UPDATE invitations SET name = ? WHERE id = ?", [name, req.params.id]);
    } else if (template_type) {
      await connection.execute("UPDATE invitations SET template_type = ? WHERE id = ?", [template_type, req.params.id]);
    }
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/invitations/:id", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM invitations WHERE id = ?", [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/invitations/bulk-delete", async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "IDs array required" });
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("DELETE FROM invitations WHERE id IN (?)", [ids]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/invitations/:id/sent", async (req, res) => {
  const { is_sent } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("UPDATE invitations SET is_sent = ? WHERE id = ?", [is_sent ? 1 : 0, req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/invitations/by-id/:shortId", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM invitations WHERE short_id = ?", [req.params.shortId]);
    await connection.end();
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve assets directly - this prevents meta tag logic from running on images/js/css
app.use("/assets", express.static(path.join(__dirname, "../dist/assets")));
app.use("/audio", express.static(path.join(__dirname, "../dist/audio")));

// SPA Fallback: All other requests serve index.html with dynamic meta tags
app.use(async (req, res) => {
  if (req.method !== "GET") return res.status(404).json({ error: "Not found" });
  
  // Exclude static assets that might have slipped through
  if (req.path.includes(".") && !req.path.startsWith("/api")) {
    const assetPath = path.join(__dirname, "../dist", req.path);
    if (fs.existsSync(assetPath)) return res.sendFile(assetPath);
  }

  const segments = req.path.split("/").filter(Boolean);
  const potentialId = segments.length > 1 ? segments[1] : (segments.length === 1 ? segments[0] : null);
  let guestInfo = null;
  let openingImage = "https://res.cloudinary.com/du7sy9ixt/image/upload/v1740342371/wedding-thumbnail.jpg";

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Fetch opening image from settings
    const [settingRows] = await connection.execute("SELECT value_content FROM site_settings WHERE key_name = 'opening_image'");
    if (settingRows.length > 0 && settingRows[0].value_content) {
      openingImage = settingRows[0].value_content;
    }

    if (potentialId && potentialId.length >= 6 && potentialId.length <= 10) {
      const [rows] = await connection.execute("SELECT * FROM invitations WHERE short_id = ?", [potentialId]);
      if (rows.length > 0) guestInfo = rows[0];
    }
    
    // Also check query params if direct d/r path or no guestId found yet
    if (!guestInfo) {
      const firstSegment = segments[0] || "";
      const isSidePath = firstSegment === "d" || firstSegment === "r" || segments.length === 0;
      if (isSidePath) {
        const name = req.query.name || req.query.to;
        if (name) {
          guestInfo = { 
            name, 
            side: firstSegment === "d" ? "bride" : (firstSegment === "r" ? "groom" : "both") 
          };
        }
      }
    }
    
    await connection.end();
  } catch (e) {
    console.error("Error fetching guest for meta:", e);
  }

  const distPath = path.join(__dirname, "../dist");
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, "utf8");
    
    const title = guestInfo 
      ? `Thân mời ${guestInfo.name} - Đám cưới Phạm Khải & Lê Nga`
      : `Thư Mời Cưới - Phạm Khải & Lê Nga`;
    const description = "Trân trọng kính mời bạn tới tham dự lễ thành hôn của chúng mình vào ngày 04.04.2026!";
    const image = openingImage;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentUrl = `${protocol}://${req.headers.host}${req.originalUrl}`;

    const metaTags = `
      <title>${title}</title>
      <meta name="description" content="${description}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:url" content="${currentUrl}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="Đám Cưới Khải & Nga">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
    `;

    // Ensure we don't have duplicate titles or descriptions
    html = html.replace(/<title>.*?<\/title>/gi, "");
    html = html.replace(/<meta name="description".*?>/gi, "");
    html = html.replace(/<meta property="og:title".*?>/gi, "");
    html = html.replace(/<meta property="og:description".*?>/gi, "");
    html = html.replace(/<meta property="og:image".*?>/gi, "");

    if (html.includes("<!-- OG_TAGS -->")) {
      html = html.replace("<!-- OG_TAGS -->", metaTags);
    } else {
      html = html.replace("<head>", `<head>${metaTags}`);
    }

    res.send(html);
  } else {
    res.status(404).send("Application not built. Run 'yarn build' first.");
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
