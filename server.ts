import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

// Ensure data directory and projects file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PROJECTS_FILE)) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/projects", (req, res) => {
    try {
      if (!fs.existsSync(PROJECTS_FILE)) {
        return res.json([]);
      }
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Fetch projects error:", error);
      res.status(500).json({ error: "Projeler okunamadı" });
    }
  });

  app.post("/api/projects", (req, res) => {
    try {
      const { name, description, image, technologies, mainLink, secondLink } = req.body;
      
      if (!name || !description || !image || !technologies || !mainLink) {
        return res.status(400).json({ error: "Eksik alanlar var" });
      }

      let projects = [];
      if (fs.existsSync(PROJECTS_FILE)) {
        try {
          projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
        } catch (e) {
          console.error("Malformed JSON:", e);
          projects = [];
        }
      }
      
      const newProject = {
        id: uuidv4(),
        name,
        description,
        image,
        technologies: Array.isArray(technologies) ? technologies : String(technologies).split(",").map((t: string) => t.trim()),
        mainLink,
        secondLink: secondLink || "",
        createdAt: new Date().toISOString()
      };

      projects.push(newProject);
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
      
      res.json(newProject);
    } catch (error) {
      console.error("Post project error:", error);
      res.status(500).json({ error: "Proje eklenemedi" });
    }
  });

  app.delete("/api/projects/:id", (req, res) => {
    try {
      const { id } = req.params;
      let projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
      const initialLength = projects.length;
      projects = projects.filter((p: any) => String(p.id) !== String(id));
      
      if (projects.length === initialLength) {
        return res.status(404).json({ error: "Proje bulunamadı" });
      }

      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Proje silinemedi" });
    }
  });

  app.put("/api/projects/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, image, technologies, mainLink, secondLink } = req.body;
      
      let projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
      const index = projects.findIndex((p: any) => String(p.id) === String(id));
      
      if (index === -1) {
        return res.status(404).json({ error: "Proje bulunamadı" });
      }

      projects[index] = {
        ...projects[index],
        name: name || projects[index].name,
        description: description || projects[index].description,
        image: image || projects[index].image,
        technologies: Array.isArray(technologies) ? technologies : (technologies ? String(technologies).split(",").map((t: string) => t.trim()) : projects[index].technologies),
        mainLink: mainLink || projects[index].mainLink,
        secondLink: secondLink !== undefined ? secondLink : projects[index].secondLink
      };

      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
      res.json(projects[index]);
    } catch (error) {
      res.status(500).json({ error: "Proje güncellenemedi" });
    }
  });

  // API 404 handler - MUST be after all API routes but before Vite/fallback
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.originalUrl}` });
  });

  const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT !== undefined;

  console.log(`Starting server in ${isProduction ? "production" : "development"} mode...`);

  // Vite middleware for development
  if (!isProduction) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite development middleware loaded.");
    } catch (e) {
      console.error("Failed to start Vite server:", e);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Serving static files from: ${distPath}`);
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.error("ERROR: dist directory not found! Run 'npm run build' first.");
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
