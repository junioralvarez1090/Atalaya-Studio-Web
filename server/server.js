const path = require("path");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const db = require("./db");

const app = express();
const publicPath = path.join(__dirname, "..");

db.initDatabase();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "10kb" }));

var limiter = rateLimit({ windowMs: 3600000, max: 5 });

app.post("/api/contact", limiter, function(req, res) {
    try {
        var body = req.body;
        var nombre = body.nombre;
        var email = body.email;
        var servicio = body.servicio;
        var mensaje = body.mensaje;
        if (!nombre || !email || !mensaje) return res.status(400).json({ error: "Faltan campos" });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: "Email invalido" });
        var contact = db.insertContact({ nombre: String(nombre).trim().slice(0,100), email: String(email).trim().slice(0,254), servicio: String(servicio||"").trim(), mensaje: String(mensaje).trim().slice(0,2000) }, req);
        res.status(201).json({ message: "Mensaje recibido correctamente.", data: contact });
    } catch (err) { res.status(500).json({ error: "Error del servidor" }); }
});

app.get("/api/contacts", function(req, res) {
    try { res.json({ data: db.getContacts({ limit: 50, offset: 0 }) }); } catch (err) { res.status(500).json({ error: "Error" }); }
});

app.use(express.static(publicPath));

app.listen(process.env.PORT || 3000, function() {
    console.log("ATALAYA STUDIO SERVER - Puerto: " + (process.env.PORT || 3000));
});

process.on("SIGINT", function() {
    db.closeDatabase();
    process.exit(0);
});
