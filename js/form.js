/**
 * form.js
 * Validación y envío del formulario de contacto
 * Envía datos al backend Node.js vía Fetch API
 */

import { showToast } from './main.js';

/** URL del endpoint de la API (cambiar si el server corre en otro puerto) */
const API_URL = 'https://atalaya-studio-web.onrender.com/api/contact';

/** Patrón de validación de email */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Muestra un error inline en un campo del formulario
 * @param {HTMLElement} field - Input o textarea
 * @param {string} message - Mensaje de error
 */
function showFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;

    let errorEl = group.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        group.appendChild(errorEl);
    }

    errorEl.textContent = message;
    group.classList.add('invalid');
}

/**
 * Limpia el error inline de un campo
 * @param {HTMLElement} field
 */
function clearFieldError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('invalid');
}

/**
 * Valida un campo individual
 * @param {HTMLElement} field
 * @returns {boolean}
 */
function validateField(field) {
    clearFieldError(field);

    const value = field.value.trim();
    const name = field.name;

    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }

    if (name === 'email' && value && !EMAIL_REGEX.test(value)) {
        showFieldError(field, 'Ingresa un correo electrónico válido');
        return false;
    }

    if (name === 'nombre' && value && value.length < 2) {
        showFieldError(field, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }

    return true;
}

/**
 * Valida todo el formulario
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Recopila los datos del formulario como objeto limpio
 * @param {HTMLFormElement} form
 * @returns {Object}
 */
function getFormData(form) {
    const data = {};
    const fields = form.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
        data[field.name] = field.value.trim();
    });

    return data;
}

/**
 * Deshabilita/habilita el formulario y muestra estado de carga
 * @param {HTMLFormElement} form
 * @param {boolean} loading
 */
function setFormLoading(form, loading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const fields = form.querySelectorAll('input, textarea, select');

    fields.forEach(f => {
        f.disabled = loading;
    });

    if (submitBtn) {
        submitBtn.disabled = loading;
        submitBtn.classList.toggle('loading', loading);
    }
}

/**
 * Limpia todos los campos y errores del formulario
 * @param {HTMLFormElement} form
 */
function resetForm(form) {
    form.reset();
    form.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('invalid');
    });
}

/**
 * Inicializa el formulario: eventos de validación y envío
 * @param {HTMLFormElement} form
 */
export function initForm(form) {
    if (!form) return;

    /* Validación en tiempo real al salir del campo */
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.form-group')?.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });

    /* Envío del formulario */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(form)) {
            showToast('Por favor, corrige los errores del formulario', 'error');
            return;
        }

        const data = getFormData(form);
        setFormLoading(form, true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error del servidor (${response.status})`);
            }

            const result = await response.json();
            showToast(result.message || 'Mensaje enviado correctamente', 'success');
            resetForm(form);

        } catch (error) {
            console.error('Error al enviar formulario:', error);

            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                showToast('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose.', 'error');
            } else {
                showToast(error.message || 'Error al enviar el formulario', 'error');
            }
        } finally {
            setFormLoading(form, false);
        }
    });
}
