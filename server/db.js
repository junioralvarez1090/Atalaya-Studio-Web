/**
 * db.js
 * Almacenamiento de contactos en archivo JSON
 * Sin dependencias nativas — funciona en cualquier versión de Node.js
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'contacts.json');

/** Lee los contactos del archivo JSON */
function readData() {
    try {
        if (!fs.existsSync(DATA_PATH)) return [];
        const raw = fs.readFileSync(DATA_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

/** Escribe los contactos al archivo JSON */
function writeData(data) {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function initDatabase() {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_PATH)) {
        writeData([]);
    }
    console.log('[DB] Almacenamiento inicializado en: ' + DATA_PATH);
}

function insertContact(data, req) {
    const contacts = readData();

    const newContact = {
        id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
        nombre: data.nombre,
        email: data.email,
        servicio: data.servicio || '',
        mensaje: data.mensaje || '',
        ip_address: req?.ip || '',
        user_agent: req?.get('User-Agent') || '',
        created_at: new Date().toISOString()
    };

    contacts.push(newContact);
    writeData(contacts);

    return {
        id: newContact.id,
        nombre: newContact.nombre,
        email: newContact.email
    };
}

function getContacts(options = {}) {
    const contacts = readData();
    const limit = Math.min(Math.max(1, options.limit || 50), 200);
    const offset = Math.max(0, options.offset || 0);
    return contacts
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(offset, offset + limit);
}

function closeDatabase() {
    console.log('[DB] Conexión cerrada');
}

module.exports = {
    initDatabase,
    insertContact,
    getContacts,
    closeDatabase
};