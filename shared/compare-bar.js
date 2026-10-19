/* ==================== shared/compare-bar.js ==================== */

(function() {
    'use strict';

    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/Pages/') || path.includes('/Auth/') ||
            path.includes('/Support/') ||
            path.includes('/pages/') || path.includes('/auth/') ||
            path.includes('/support/')) {
            return '../';
        }
        return '';
    }

    const BASE = getBasePath();

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function buildCompareBar() {
        if (document.querySelector('.compare-bar')) return;

        const bar = document.createElement('div');
        bar.className = 'compare-bar';
        bar.id = 'compareBar';
        bar.innerHTML = `
            <div class="compare-bar-inner">
                <div class="compare-bar-info">
                    <i class="fas fa-balance-scale"></i>
                    <span>المقارنة</span>
                    <span class="count-badge" id="compareBarCount">0</span>
                    <span style="color:rgba(255,255,255,0.5);font-weight:600;">/ 2</span>
                </div>

                <div class="compare-bar-items" id="compareBarItems"></div>

                <div class="compare-bar-actions">
                    <button class="btn-compare-clear" id="compareBarClear" title="مسح الكل">
                        <i class="fas fa-times"></i>
                        <span>مسح</span>
                    </button>
                    <a href="${BASE}Pages/compare.html" class="btn-compare disabled" id="compareBarGo">
                        <i class="fas fa-balance-scale"></i>
                        <span>قارن الآن</span>
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(bar);

        bar.querySelector('#compareBarClear').addEventListener('click', () => {
            if (window.clearCompare) {
                window.clearCompare();
                updateCompareBar();
            }
        });

        window.addEventListener('compareUpdated', updateCompareBar);
    }

    function updateCompareBar() {
        const bar = document.getElementById('compareBar');
        if (!bar) return;

        const list = window.getCompareList ? window.getCompareList() : [];
        const count = list.length;

        document.getElementById('compareBarCount').textContent = count;

        const itemsEl = document.getElementById('compareBarItems');
        itemsEl.innerHTML = '';

        if (count === 0) {
            itemsEl.innerHTML = '<span class="compare-bar-empty">مفيش منتجات — اختار منتجين للمقارنة</span>';
        } else {
            list.forEach(item => {
                const chip = document.createElement('div');
                chip.className = 'compare-bar-item';
                chip.innerHTML = `
                    <span title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
                    <button type="button" aria-label="إزالة">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                chip.querySelector('button').addEventListener('click', () => {
                    if (window.removeFromCompare) {
                        window.removeFromCompare(item.id);
                        updateCompareBar();
                    }
                });
                itemsEl.appendChild(chip);
            });
        }

        bar.classList.toggle('show', count > 0);

        const goBtn = document.getElementById('compareBarGo');
        if (goBtn) {
            goBtn.classList.toggle('disabled', count < 2);
        }

        document.body.style.paddingBottom = count > 0 ? '100px' : '';
    }

    function init() {
        buildCompareBar();
        updateCompareBar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ Compare bar loaded');
})();