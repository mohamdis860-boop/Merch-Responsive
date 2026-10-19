/* ==================== shared/wishlist.js ==================== */

(function() {
    'use strict';

    const GUEST_KEY = 'wishlist_guest';
    const LEGACY_KEY = 'wishlist';

    function migrateLegacyWishlist() {
        try {
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (!legacy) return;

            console.log('🔄 Migration: نقل المفضلة القديمة...');

            const oldWishlist = JSON.parse(legacy);
            if (Array.isArray(oldWishlist) && oldWishlist.length > 0) {
                const guestWishlist = JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
                const merged = [...new Set([...guestWishlist, ...oldWishlist])];
                localStorage.setItem(GUEST_KEY, JSON.stringify(merged));
            }

            localStorage.removeItem(LEGACY_KEY);
            console.log('✅ Wishlist migration complete');
        } catch (e) {
            console.warn('⚠️ Wishlist migration failed:', e);
        }
    }

    migrateLegacyWishlist();

    function getWishlistKey() {
        const userId = window.currentUser?.id;
        return userId ? `wishlist_${userId}` : GUEST_KEY;
    }

    window.getWishlist = function() {
        try {
            const key = getWishlistKey();
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('⚠️ فشل قراءة المفضلة:', e);
            return [];
        }
    };

    window.saveWishlist = function(wishlist) {
        try {
            const key = getWishlistKey();
            localStorage.setItem(key, JSON.stringify(wishlist || []));
            window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } catch (e) {
            console.warn('⚠️ فشل حفظ المفضلة:', e);
        }
    };

    window.isInWishlist = function(productId) {
        const wishlist = window.getWishlist();
        return wishlist.some(id => String(id) === String(productId));
    };

    window.toggleWishlist = function(productId) {
        const wishlist = window.getWishlist();
        const strId = String(productId);
        const exists = wishlist.some(id => String(id) === strId);

        if (exists) {
            const newWishlist = wishlist.filter(id => String(id) !== strId);
            window.saveWishlist(newWishlist);
            if (window.showToast) {
                window.showToast('💔 تم إزالة المنتج من المفضلة', 'info');
            }
            return false;
        } else {
            wishlist.push(strId);
            window.saveWishlist(wishlist);
            if (window.showToast) {
                window.showToast('❤️ تم إضافة المنتج للمفضلة', 'success');
            }
            return true;
        }
    };

    window.addToWishlist = function(productId) {
        const wishlist = window.getWishlist();
        const strId = String(productId);

        if (!wishlist.some(id => String(id) === strId)) {
            wishlist.push(strId);
            window.saveWishlist(wishlist);
        }
    };

    window.removeWishlistItem = function(productId) {
        const wishlist = window.getWishlist();
        const newWishlist = wishlist.filter(id => String(id) !== String(productId));
        window.saveWishlist(newWishlist);
    };

    window.clearWishlistItems = function() {
        window.saveWishlist([]);
        if (window.showToast) {
            window.showToast('🗑️ تم تفريغ المفضلة', 'info');
        }
    };

    window.getWishlistCount = function() {
        return window.getWishlist().length;
    };

    window.mergeGuestWishlist = function(userId) {
        try {
            const guestWishlist = JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
            if (guestWishlist.length === 0) return;

            console.log('🔄 دمج wishlist الزائر مع المستخدم:', userId);

            const userKey = `wishlist_${userId}`;
            const userWishlist = JSON.parse(localStorage.getItem(userKey)) || [];

            const merged = [...new Set([...userWishlist, ...guestWishlist])];

            localStorage.setItem(userKey, JSON.stringify(merged));
            localStorage.removeItem(GUEST_KEY);

            console.log('✅ تم دمج wishlist بنجاح');

            window.dispatchEvent(new CustomEvent('wishlistUpdated'));

        } catch (e) {
            console.warn('⚠️ فشل دمج wishlist:', e);
        }
    };

    function checkReady() {
        if (window.currentUser !== undefined) {
            window.wishlistReadyFired = true;
            window.dispatchEvent(new CustomEvent('wishlistReady'));
        } else {
            window.addEventListener('authReady', () => {
                window.wishlistReadyFired = true;
                window.dispatchEvent(new CustomEvent('wishlistReady'));
            }, { once: true });
        }
    }

    checkReady();

    console.log('✅ Wishlist module loaded');
})();