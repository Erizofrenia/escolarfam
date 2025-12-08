import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connection from "./config/database.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import escuelasRoutes from "./routes/escuelas.js";
import recogidasRoutes from "./routes/recogidas.js";
import mensajesRoutes from "./routes/mensajes.js";
import notificacionesRoutes from "./routes/notificaciones.js";
import personasConfianzaRoutes from "./routes/personasConfianza.js";
import avisosRoutes from "./routes/avisos.js";
import configRoutes from "./routes/config.js";
import consultasRoutes from "./routes/consultas.js";
import amigosRoutes from "./routes/amigos.js";
import asistenciaRoutes from "./routes/asistencia.js";

dotenv.config();

const app = express();
 
// Necesario para rutas absolutas en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON y archivos (aumentado para logos base64)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir los archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Servir la carpeta media (fotos de perfil, etc.)
app.use("/media", express.static(path.join(__dirname, "media")));

// Endpoint de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "Servidor Node.js funcionando correctamente 🚀" });
});


// Rutas API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/escuelas", escuelasRoutes);
app.use("/api/recogidas", recogidasRoutes);
app.use("/api/mensajes", mensajesRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/personas-confianza", personasConfianzaRoutes);
app.use("/api/avisos", avisosRoutes);
app.use("/api/config", configRoutes);
app.use("/api/consultas", consultasRoutes);
app.use("/api/amigos", amigosRoutes);
app.use("/api/asistencia", asistenciaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});