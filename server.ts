import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.join(__dirname, "projects.json");

// Ensure projects file exists
if (!fs.existsSync(PROJECTS_FILE)) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.get("/api/projects", (req, res) => {
    try {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Projeler okunamadı" });
    }
  });

  app.post("/api/projects", (req, res) => {
    try {
      const { name, description, image, technologies, mainLink, secondaryLink } = req.body;
      
      if (!name || !description || !image || !technologies || !mainLink) {
        return res.status(400).json({ error: "Eksik alanlar var" });
      }

      const projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
      
      const newProject = {
        id: uuidv4(),
        name,
        description,
        image,
        technologies: Array.isArray(technologies) ? technologies : technologies.split(",").map((t: string) => t.trim()),
        mainLink,
        secondaryLink: secondaryLink || ""
      };

      projects.push(newProject);
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
      
      res.json(newProject);
    } catch (error) {
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
      const { name, description, image, technologies, mainLink, secondaryLink } = req.body;
      
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
        technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(",").map((t: string) => t.trim()) : projects[index].technologies),
        mainLink: mainLink || projects[index].mainLink,
        secondaryLink: secondaryLink !== undefined ? secondaryLink : projects[index].secondaryLink
      };

      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
      res.json(projects[index]);
    } catch (error) {
      res.status(500).json({ error: "Proje güncellenemedi" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
