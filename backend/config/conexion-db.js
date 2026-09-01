const { Pool } = require("pg");

const conexion_db = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "miapp",
  port: 5432,
  max: 10,                 // máximo de conexiones simultáneas
  idleTimeoutMillis: 30000 // cierra conexiones inactivas a los 30s
});

module.exports = conexion_db;
