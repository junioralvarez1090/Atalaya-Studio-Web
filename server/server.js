const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { initDatabase, insertContact, getContacts, closeDatabase } = require('./db');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

/* Iniciar base de datos */
initDatabase();

/* Seguridad */
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10kb' }));

/* Limitar peticiones de contacto */
const limiter = rateLimit({
    windowMs: 3600000,
    max: 5,
    message: { error: 'Demasiadas solicitudes. Intenta más tarde.' }
});

/* Servir archivos estáticos */
const publicPath = path.join(__dirname, '..');
app.use(express.static(publicPath));

/* Endpoint: guardar contacto */
app.post('/api/contact', limiter, (req, res) => {
    try {
        const { nombre, email, servicio, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        const contact = insertContact({
            nombre: String(nombre).trim().slice(0, 100),
            email: String(email).trim().slice(0, 254),
            servicio: String(servicio || '').trim().slice(0, 50),
            mensaje: String(mensaje).trim().slice(0, 2000)
        }, req);

        res.status(201).json({
            message: 'Mensaje recibido correctamente.',
            data: contact
        });
    } catch (err) {
        console.error('Error al guardar:', err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

/* Endpoint: ver contactos */
app.get('/api/contacts', (req, res) => {
    try {
        const contacts = getContacts({
            limit: parseInt(req.query.limit, 10) || 50,
            offset: parseInt(req.query.offset, 10) || 0
        });
        res.json({ data: contacts, count: contacts.length });
    } catch (err) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

/* Para cualquier otra ruta, servir index.html */
app.get('*', (req, res) => {
    try {
        const filePath = path.join(publicPath, 'index.html');
        const html = fs.readFileSync(filePath, 'utf-8');
        res.type('html').send(html);
    } catch (err) {
        res.status(404).send('Página no encontrada');
    }
});

/* Iniciar */
app.listen(PORT, () => {
    console.log('');
    console.log('  ATALAYA STUDIO SERVER');
    console.log('  Puerto: ' + PORT);
    console.log('  URL: http://localhost:' + PORT);
    console.log('');
});

process.on('SIGINT', () => { closeDatabase(); process.exit(0); });