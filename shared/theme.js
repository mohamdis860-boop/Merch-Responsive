/* ==================== shared/theme.js ==================== */

(function() {
    'use strict';

    const STORAGE_KEY = 'theme';
    const DEFAULT_THEME = 'dark';

    function getInitialTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        return DEFAULT_THEME;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);

        updateToggleIcon(theme);

        console.log(`🎨 Theme: ${theme}`);
    }

    function updateToggleIcon(theme) {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        const icon = btn.querySelector('i');
        if (!icon) return;

        if (theme === 'light') {
            icon.className = 'fas fa-moon';
            btn.setAttribute('aria-label', 'تبديل إلى الوضع الليلي');
            btn.setAttribute('title', 'الوضع الليلي');
        } else {
            icon.className = 'fas fa-sun';
            btn.setAttribute('aria-label', 'تبديل إلى الوضع النهاري');
            btn.setAttribute('title', 'الوضع النهاري');
        }
    }

    function createToggleButton() {
        if (document.querySelector('.theme-toggle')) return;

        const tryAddButton = () => {
            const navLinks = document.querySelector('.navbar .nav-links');
            if (!navLinks) return false;

            if (document.querySelector('.theme-toggle')) return true;

            const btn = document.createElement('button');
            btn.className = 'theme-toggle';
            btn.type = 'button';
            btn.innerHTML = '<i class="fas fa-sun"></i>';

            btn.addEventListener('click', toggleTheme);

            const wishlist = navLinks.querySelector('.wishlist-badge');
            if (wishlist) {
                navLinks.insertBefore(btn, wishlist);
            } else {
                navLinks.appendChild(btn);
            }

            const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
            updateToggleIcon(currentTheme);

            return true;
        };

        if (!tryAddButton()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (tryAddButton() || attempts > 20) {
                    clearInterval(interval);
                }
            }, 100);
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);

        if (window.showToast) {
            const msg = next === 'light' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
            window.showToast(msg, 'info', 1500);
        }
    }

    function watchSystemTheme() {
        if (!window.matchMedia) return;

        const media = window.matchMedia('(prefers-color-scheme: light)');

        const handler = (e) => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        };

        if (media.addEventListener) {
            media.addEventListener('change', handler);
        } else if (media.addListener) {
            media.addListener(handler);
        }
    }

    function init() {
        const initialTheme = getInitialTheme();
        document.documentElement.setAttribute('data-theme', initialTheme);

        const setup = () => {
            createToggleButton();
            updateToggleIcon(initialTheme);
            watchSystemTheme();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    init();

    window.toggleTheme = toggleTheme;
    window.getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;

    console.log('✅ Theme module loaded');
})();