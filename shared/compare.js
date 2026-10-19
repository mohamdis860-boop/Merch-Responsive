/* ==================== shared/compare.js ==================== */

(function() {
    'use strict';

    const STORAGE_KEY = 'compare_list';
    const MAX_ITEMS = 2;

    window.getCompareList = function() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('⚠️ فشل قراءة قائمة المقارنة:', e);
            return [];
        }
    };

    window.saveCompareList = function(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
            window.dispatchEvent(new CustomEvent('compareUpdated'));
        } catch (e) {
            console.warn('⚠️ فشل حفظ قائمة المقارنة:', e);
        }
    };

    window.toggleCompare = function(product) {
        const list = window.getCompareList();
        const exists = list.find(p => String(p.id) === String(product.id));

        if (exists) {
            const newList = list.filter(p => String(p.id) !== String(product.id));
            window.saveCompareList(newList);
            if (window.showToast) window.showToast('تم الحذف من المقارنة', 'info');
            return false;
        }

        if (list.length >= MAX_ITEMS) {
            list.shift();
            if (window.showToast) {
                window.showToast('تم استبدال أقدم منتج', 'warning');
            }
        }

        list.push(product);
        window.saveCompareList(list);
        if (window.showToast) window.showToast(`تمت إضافة "${product.name}"`, 'success');
        return true;
    };

    window.removeFromCompare = function(productId) {
        const list = window.getCompareList();
        const newList = list.filter(p => String(p.id) !== String(productId));
        window.saveCompareList(newList);
    };

    window.clearCompare = function() {
        window.saveCompareList([]);
        if (window.showToast) window.showToast('تم تفريغ المقارنة', 'info');
    };

    window.isInCompare = function(productId) {
        return window.getCompareList().some(p => String(p.id) === String(productId));
    };

    window.getCompareCount = function() {
        return window.getCompareList().length;
    };

    console.log('✅ Compare module loaded');
})();