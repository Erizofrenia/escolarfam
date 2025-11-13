import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connection from "./config/database.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import escuelasRoutes from "./routes/escuelas.js";

dotenv.config();

const app = express();
 
// Necesario para rutas absolutas en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir los archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Endpoint de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "Servidor Node.js funcionando correctamente 🚀" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.json()); // Necesario para recibir JSON
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/escuelas", escuelasRoutes);