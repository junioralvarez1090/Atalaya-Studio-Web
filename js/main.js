/**
 * main.js
 * Módulo principal: tema, menú, scroll, testimonios, toast
 */

import { storage } from './storage.js';
import { initForm } from './form.js';

/* ==========================
   TOAST NOTIFICATIONS
========================== */

let toastContainer = null;

/**
 * Crea el contenedor de toasts si no existe
 */
function ensureToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Muestra una notificación toast
 * @param {string} message - Texto del mensaje
 * @param {'success'|'error'|'info'} type - Tipo de toast
 * @param {number} duration - Duración en milisegundos
 */
export function showToast(message, type = 'info', duration = 4500) {
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;

    container.appendChild(toast);

    /* Forzar reflow para la animación */
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
}

/* ==========================
   TEMA CLARO/OSCURO
========================== */

function initTheme() {
    const themeBtn = document.querySelector('#theme-toggle');
    if (!themeBtn) return;

    const saved = storage.getTheme();

    if (saved === 'dark') {
        document.body.classList.add('dark');
        themeBtn.setAttribute('aria-label', 'Cambiar a modo claro');
        themeBtn.textContent = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');

        themeBtn.textContent = isDark ? '☀️' : '🌙';
        themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        storage.setTheme(isDark ? 'dark' : 'light');
    });
}

/* ==========================
   MENÚ MÓVIL
========================== */

function initMenu() {
    const toggle = document.querySelector('#menu-toggle');
    const menu = document.querySelector('#menu');
    const overlay = document.querySelector('.menu-overlay');

    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
        toggle.textContent = '✕';
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        toggle.textContent = '☰';
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('active');
        isOpen ? closeMenu() : openMenu();
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    /* Cerrar al hacer clic en un enlace del menú */
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* Cerrar con tecla Escape */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
            toggle.focus();
        }
    });
}

/* ==========================
   HEADER SCROLL
========================== */

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 10);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ==========================
   SCROLL REVEAL
========================= */

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ==========================
   BACK TO TOP
========================== */

function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                btn.classList.toggle('visible', window.scrollY > 500);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================
   TESTIMONIOS (API)
========================== */

async function cargarTestimonios() {
    const contenedor = document.querySelector('#contenedor-testimonios');
    if (!contenedor) return;

    /* Mostrar skeletons mientras carga */
    for (let i = 0; i < 3; i++) {
        const skel = document.createElement('div');
        skel.className = 'skeleton skeleton-card';
        contenedor.appendChild(skel);
    }

    try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!respuesta.ok) throw new Error('Error en la conexión con la API');

        const usuarios = await respuesta.json();
        const muestra = usuarios.slice(0, 3);

        /* Limpiar skeletons */
        contenedor.innerHTML = '';

        muestra.forEach((usuario, index) => {
            const card = document.createElement('article');
            card.className = 'testimonio-card reveal';
            card.style.transitionDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <span class="testimonio-card__quote" aria-hidden="true">"</span>
                <h3>${usuario.name}</h3>
                <p>Trabaja en: <strong>${usuario.company.name}</strong></p>
                <small>${usuario.email}</small>
                <hr>
            `;

            contenedor.appendChild(card);
        });

        /* Re-observar las nuevas cards para scroll reveal */
        initScrollReveal();

    } catch (error) {
        console.error('Falló la carga de testimonios:', error);
        contenedor.innerHTML = `
            <p style="grid-column:1/-1;color:var(--color-text-muted);padding:40px 0;">
                No se pudieron cargar los testimonios en este momento.
            </p>
        `;
    }
}

/* ==========================
   ENLACE ACTIVO EN NAV
========================== */

function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header__menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ==========================
   LIGHTBOX / GALERÍA
========================= */

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox__img');
    const counter = lightbox.querySelector('.lightbox__counter');
    const btnClose = lightbox.querySelector('.lightbox__close');
    const btnPrev = lightbox.querySelector('.lightbox__prev');
    const btnNext = lightbox.querySelector('.lightbox__next');

    const items = document.querySelectorAll('.galeria__item');
    if (!items.length) return;

    let currentIndex = 0;

    /* Recopilar datos de las imágenes */
    const images = Array.from(items).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        title: item.querySelector('h4')?.textContent || ''
    }));

    function open(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        btnClose.focus();
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        items[currentIndex]?.focus();
    }

    function updateLightbox() {
        const data = images[currentIndex];
        img.src = data.src;
        img.alt = data.alt;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    /* Eventos en los items de la galería */
    items.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('click', () => {
            open(parseInt(item.dataset.index, 10));
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(parseInt(item.dataset.index, 10));
            }
        });
    });

    /* Controles del lightbox */
    btnClose.addEventListener('click', close);
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    /* Cerrar con clic fuera de la imagen */
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    /* Navegación con teclado */
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    /* Gestos táctiles (swipe) */
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    }, { passive: true });
}

/* ==========================
   INICIALIZACIÓN
========================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    initHeaderScroll();
    initScrollReveal();
    initBackToTop();
    highlightActiveNav();
    initLightbox();

    /* Formulario */
    const formulario = document.querySelector('#contacto form');
    if (formulario) {
        initForm(formulario);
    }

    /* Testimonios (solo en index) */
    if (document.querySelector('#contenedor-testimonios')) {
        cargarTestimonios();
    }
});