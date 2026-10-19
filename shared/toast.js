/* ==================== shared/toast.js ==================== */

(function() {
    'use strict';

    let toastTimeout = null;

    function ensureToastElement() {
        let toast = document.getElementById('sharedToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sharedToast';
            toast.className = 'toast';
            toast.innerHTML = `
                <i class="fas fa-info-circle" id="sharedToastIcon"></i>
                <span id="sharedToastMessage">رسالة</span>
            `;
            document.body.appendChild(toast);
        }
        return toast;
    }

    window.showToast = function(message, type = 'info', duration = 3000) {
        const toast = ensureToastElement();
        const toastMessage = document.getElementById('sharedToastMessage');
        const toastIcon = document.getElementById('sharedToastIcon');

        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toastIcon.className = iconMap[type] || iconMap.info;
        toastMessage.textContent = message;

        toast.className = 'toast';
        void toast.offsetWidth; // force reflow
        toast.classList.add('show', type);

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    console.log('✅ Toast loaded');
})();