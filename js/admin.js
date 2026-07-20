/**
 * admin.js
 * Vista de registros de contactos
 * Se integra con la estructura existente (storage, main)
 */

import { storage } from './storage.js';

const API_URL = window.location.origin + '/api/contacts';

const SERVICIO_LABELS = {
    'diseno-web': 'Diseño Web',
    'desarrollo': 'Desarrollo',
    'seo': 'SEO',
    'branding': 'Branding',
    'ia': 'Estrategia IA',
    'otro': 'Otro'
};

const COLORS = ['#2563EB', '#60A5FA', '#0F172A', '#64748B', '#1E3A8A', '#93C5FD'];

/* ==========================
   PETICIONES
========================= */

async function fetchContacts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error ' + res.status);
    const data = await res.json();
    return data.data;
}

/* ==========================
   UTILIDADES
========================= */

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(iso) {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
}

function getServicioCounts(contacts) {
    const counts = {};
    contacts.forEach(c => {
        if (c.servicio) counts[c.servicio] = (counts[c.servicio] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

/* ==========================
   ESTADÍSTICAS
========================= */

function updateStats(contacts) {
    const el = (id) => document.getElementById(id);

    if (el('total-count')) el('total-count').textContent = contacts.length;

    if (el('today-count')) {
        const today = new Date().toDateString();
        el('today-count').textContent = contacts.filter(c => new Date(c.created_at).toDateString() === today).length;
    }

    if (el('services-count')) {
        el('services-count').textContent = new Set(contacts.filter(c => c.servicio).map(c => c.servicio)).size;
    }
}

/* ==========================
   GRÁFICO DE DONA
========================= */

function renderDona(contacts) {
    const donaEl = document.getElementById('dona-chart');
    const legendEl = document.getElementById('dona-legend');
    const emptyEl = document.getElementById('dona-empty');
    if (!donaEl) return;

    const entries = getServicioCounts(contacts);
    const total = entries.reduce((s, e) => s + e[1], 0);

    if (entries.length === 0) {
        donaEl.style.background = 'var(--color-bg-alt)';
        legendEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    let deg = 0;
    const gradients = entries.map(([key, count], i) => {
        const slice = (count / total) * 360;
        const start = deg;
        deg += slice;
        return COLORS[i % COLORS.length] + ' ' + start + 'deg ' + deg + 'deg';
    });

    donaEl.style.background = 'conic-gradient(' + gradients.join(', ') + ')';
    document.getElementById('dona-total').textContent = total;

    legendEl.innerHTML = entries.map(([key, count], i) => {
        const label = SERVICIO_LABELS[key] || key;
        const pct = Math.round((count / total) * 100);
        return '<div class="dona-legend__item">' +
            '<span class="dona-legend__color" style="background:' + COLORS[i % COLORS.length] + '"></span>' +
            '<span>' + escapeHtml(label) + '</span>' +
            '<span class="dona-legend__percent">' + pct + '%</span>' +
        '</div>';
    }).join('');
}

/* ==========================
   BARRAS DE SERVICIOS
========================= */

function renderBars(contacts) {
    const barsEl = document.getElementById('service-bars');
    const emptyEl = document.getElementById('bars-empty');
    if (!barsEl) return;

    const entries = getServicioCounts(contacts);
    const max = entries.length > 0 ? entries[0][1] : 0;

    if (entries.length === 0) {
        barsEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    barsEl.innerHTML = entries.map(([key, count], i) => {
        const label = SERVICIO_LABELS[key] || key;
        const pct = max > 0 ? Math.round((count / max) * 100) : 0;
        return '<div class="service-bar">' +
            '<div class="service-bar__header">' +
                '<span class="service-bar__name">' + escapeHtml(label) + '</span>' +
                '<span class="service-bar__count">' + count + '</span>' +
            '</div>' +
            '<div class="service-bar__track">' +
                '<div class="service-bar__fill" style="width:' + pct + '%;background:' + COLORS[i % COLORS.length] + '"></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

/* ==========================
   TABLA
========================= */

function renderTable(contacts) {
    const tbody = document.getElementById('contacts-table-body');
    const emptyEl = document.getElementById('empty-state');
    const errorEl = document.getElementById('error-state');
    if (!tbody) return;

    if (emptyEl) emptyEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';

    if (contacts.length === 0) {
        tbody.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }

    tbody.innerHTML = contacts.map(c => {
        const { date, time } = formatDate(c.created_at);
        const label = SERVICIO_LABELS[c.servicio] || c.servicio || '—';
        return '<tr>' +
            '<td>#' + c.id + '</td>' +
            '<td><strong>' + escapeHtml(c.nombre) + '</strong></td>' +
            '<td>' + escapeHtml(c.email) + '</td>' +
            '<td><span class="badge">' + escapeHtml(label) + '</span></td>' +
            '<td class="msg-cell" title="' + escapeHtml(c.mensaje) + '">' + escapeHtml(c.mensaje) + '</td>' +
            '<td class="date-cell">' + date + '<br>' + time + '</td>' +
        '</tr>';
    }).join('');
}

function showError(msg) {
    const tbody = document.getElementById('contacts-table-body');
    const emptyEl = document.getElementById('empty-state');
    const errorEl = document.getElementById('error-state');
    if (tbody) tbody.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'none';
    if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
}

/* ==========================
   CARGA PRINCIPAL
========================= */

async function loadContacts() {
    try {
        const contacts = await fetchContacts();
        updateStats(contacts);
        renderDona(contacts);
        renderBars(contacts);
        renderTable(contacts);
    } catch (err) {
        console.error('Error al cargar contactos:', err);
        showError('No se pudieron cargar los contactos: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    const btn = document.getElementById('btn-refresh');
    if (btn) btn.addEventListener('click', loadContacts);
});
