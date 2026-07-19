/**
 * storage.js
 * Utilidades para gestión de sessionStorage/localStorage
 * Abstrae el acceso para facilitar pruebas y mantenimiento
 */

const STORAGE_KEYS = {
    THEME: 'atalaya_theme',
    MENU_OPEN: 'atalaya_menu_open'
};

export const storage = {

    /**
     * Obtiene un valor del sessionStorage
     * @param {string} key
     * @returns {string|null}
     */
    getSession(key) {
        try {
            return sessionStorage.getItem(key);
        } catch {
            console.warn('sessionStorage no disponible');
            return null;
        }
    },

    /**
     * Guarda un valor en sessionStorage
     * @param {string} key
     * @param {string} value
     */
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch {
            console.warn('sessionStorage no disponible');
        }
    },

    /**
     * Elimina un valor del sessionStorage
     * @param {string} key
     */
    removeSession(key) {
        try {
            sessionStorage.removeItem(key);
        } catch {
            // Silencioso
        }
    },

    /* ----- Tema ----- */

    getTheme() {
        return this.getSession(STORAGE_KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        this.setSession(STORAGE_KEYS.THEME, theme);
    },

    /* ----- Teclas ----- */

    get keys() {
        return { ...STORAGE_KEYS };
    }
};