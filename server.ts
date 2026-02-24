import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("quran.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS quran (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surah INTEGER,
    ayah INTEGER,
    text_arabic TEXT,
    text_english_sahih TEXT,
    text_english_pickthall TEXT,
    text_english_yusufali TEXT
  );

  CREATE TABLE IF NOT EXISTS surahs (
    number INTEGER PRIMARY KEY,
    name TEXT,
    englishName TEXT,
    englishNameTranslation TEXT,
    revelationType TEXT,
    numberOfAyahs INTEGER
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surah INTEGER,
    ayah INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed from AlQuran.cloud API if empty
const rowCount = db.prepare("SELECT COUNT(*) as count FROM quran").get() as { count: number };
if (rowCount.count === 0) {
  console.log("Database empty. Fetching Quran data from alquran.cloud...");
  
  const fetchQuranData = async () => {
    try {
      const editions = ['quran-uthmani', 'en.sahih', 'en.pickthall', 'en.yusufali'];
      const results = await Promise.all(editions.map(e => 
        fetch(`https://api.alquran.cloud/v1/quran/${e}`).then(res => res.json())
      ));

      const [arabic, sahih, pickthall, yusufali] = results.map(r => r.data.surahs);

      const insertSurah = db.prepare(`
        INSERT INTO surahs (number, name, englishName, englishNameTranslation, revelationType, numberOfAyahs)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const insertAyah = db.prepare(`
        INSERT INTO quran (surah, ayah, text_arabic, text_english_sahih, text_english_pickthall, text_english_yusufali)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction(() => {
        for (let i = 0; i < arabic.length; i++) {
          const s = arabic[i];
          insertSurah.run(s.number, s.name, s.englishName, s.englishNameTranslation, s.revelationType, s.ayahs.length);

          for (let j = 0; j < s.ayahs.length; j++) {
            insertAyah.run(
              s.number,
              s.ayahs[j].numberInSurah,
              s.ayahs[j].text,
              sahih[i].ayahs[j].text,
              pickthall[i].ayahs[j].text,
              yusufali[i].ayahs[j].text
            );
          }
        }
      });

      transaction();
      console.log("Quran data successfully fetched and seeded.");
    } catch (error) {
      console.error("Error fetching Quran data:", error);
    }
  };

  fetchQuranData();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/quran", (req, res) => {
    const { surah } = req.query;
    let query = "SELECT * FROM quran";
    const params = [];
    if (surah) {
      query += " WHERE surah = ?";
      params.push(surah);
    }
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  });

  app.get("/api/surahs", (req, res) => {
    const rows = db.prepare("SELECT * FROM surahs ORDER BY number").all();
    res.json(rows);
  });

  app.get("/api/search", (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    const rows = db.prepare(`
      SELECT * FROM quran 
      WHERE text_arabic LIKE ? 
      OR text_english_sahih LIKE ? 
      OR text_english_pickthall LIKE ? 
      OR text_english_yusufali LIKE ?
    `).all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    res.json(rows);
  });

  app.get("/api/bookmarks", (req, res) => {
    const rows = db.prepare("SELECT * FROM bookmarks ORDER BY created_at DESC").all();
    res.json(rows);
  });

  app.post("/api/bookmarks", (req, res) => {
    const { surah, ayah } = req.body;
    db.prepare("INSERT INTO bookmarks (surah, ayah) VALUES (?, ?)").run(surah, ayah);
    res.json({ success: true });
  });

  app.delete("/api/bookmarks/:id", (req, res) => {
    db.prepare("DELETE FROM bookmarks WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
