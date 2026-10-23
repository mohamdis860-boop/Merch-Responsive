/* ==================== shared/navbar.js ==================== */

(function() {
    'use strict';

    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/Pages/') || path.includes('/Auth/') || path.includes('/Support/')) {
            return '../';
        }
        return '';
    }

    const BASE = getBasePath();

    function buildNavbar() {
        if (document.querySelector('.navbar')) return;

        const nav = document.createElement('nav');
        nav.className = 'navbar';
        
        // الترتيب الجديد: اللوجو -> البحث -> اللينكات -> الأيقونات
        nav.innerHTML = `
            <a href="${BASE}index.html" class="logo">
                <i class="fas fa-store"></i>
                متجرنا
            </a>
            
            <div class="nav-links">
                <!-- اللينكات الأساسية -->
                <a href="${BASE}index.html" data-nav="home">
                    <i class="fas fa-home"></i> <span class="nav-text">الرئيسية</span>
                </a>
                <a href="${BASE}Pages/products.html" data-nav="products">
                    <i class="fas fa-box"></i> <span class="nav-text">المنتجات</span>
                </a>
                <a href="${BASE}Pages/categories.html" data-nav="categories">
                    <i class="fas fa-tags"></i> <span class="nav-text">التصنيفات</span>
                </a>
                <a href="${BASE}Pages/about.html" data-nav="about">
                    <i class="fas fa-info-circle"></i> <span class="nav-text">تعرف علينا</span>
                </a>

                <!-- مربع البحث -->
                <form class="nav-search" id="navSearchForm" role="search" autocomplete="off">
                    <i class="fas fa-search"></i>
                    <input type="text" id="navSearchInput" placeholder="ابحث عن منتج..." autocomplete="off">
                </form>

                <!-- الأيقونات (الإشعارات، المفضلة، السلة، البروفايل) -->
                <div class="notif-wrapper" id="notifContainer">
                    <!-- سيتم حقن الجرس هنا بواسطة notifications.js -->
                </div>

                <a href="${BASE}Pages/wishlist.html" class="wishlist-badge" data-nav="wishlist" title="المفضلة">
                    <i class="fas fa-heart"></i>
                    <span class="badge-count" id="wishlistBadge" style="display: none;">0</span>
                </a>

                <a href="${BASE}Pages/cart.html" class="cart-badge" data-nav="cart" title="السلة">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="badge-count" id="cartBadge" style="display: none;">0</span>
                </a>

                <a href="${BASE}Auth/profile.html" class="profile-btn" id="profileBtn" style="display: none;" title="حسابي">
                    <span class="profile-avatar-mini" id="profileAvatarMini">م</span>
                </a>
            </div>
        `;

        document.body.insertBefore(nav, document.body.firstChild);
    }

    function setActiveLink() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';

        const navMap = {
            'index.html': 'home', 'splash.html': 'home',
            'products.html': 'products', 'product-details.html': 'products',
            'categories.html': 'categories', 'category-products.html': 'categories',
            'about.html': 'about', 'cart.html': 'cart', 'checkout.html': 'cart',
            'wishlist.html': 'wishlist'
        };

        const activeNav = navMap[fileName];
        if (activeNav) {
            const activeLink = document.querySelector(`[data-nav="${activeNav}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }

    function updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (!cartBadge) return;
        try {
            const cart = window.getCart ? window.getCart() : [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        } catch (e) {
            cartBadge.style.display = 'none';
        }
    }
    window.updateCartBadge = updateCartBadge;

    function updateWishlistBadge() {
        const wishlistBadge = document.getElementById('wishlistBadge');
        if (!wishlistBadge) return;
        try {
            const count = window.getWishlistCount ? window.getWishlistCount() : (JSON.parse(localStorage.getItem('wishlist')) || []).length;
            wishlistBadge.textContent = count;
            wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
        } catch (e) {
            wishlistBadge.style.display = 'none';
        }
    }
    window.updateWishlistBadge = updateWishlistBadge;

    async function checkAuth() {
        const profileBtn = document.getElementById('profileBtn');
        const profileAvatarMini = document.getElementById('profileAvatarMini');

        if (!profileBtn) return;

        if (!window.supabase || !window.getSupabase) {
            addLoginButton();
            updateCartBadge();
            updateWishlistBadge();
            window.dispatchEvent(new CustomEvent('authReady'));
            return;
        }

        try {
            const supabase = window.getSupabase();
            const { data: { session } } = await supabase.auth.getSession();

            if (session && session.user) {
                const userName = session.user.user_metadata?.name || session.user.email.split('@')[0];
                profileAvatarMini.textContent = userName.charAt(0).toUpperCase();
                profileBtn.style.display = 'flex';
                window.currentUser = session.user;

                if (window.mergeGuestCart) window.mergeGuestCart(session.user.id);
                if (window.mergeGuestWishlist) window.mergeGuestWishlist(session.user.id);

                updateCartBadge();
                updateWishlistBadge();
                window.dispatchEvent(new CustomEvent('authReady'));
            } else {
                window.currentUser = null;
                profileBtn.style.display = 'none';
                addLoginButton();
                updateCartBadge();
                updateWishlistBadge();
                window.dispatchEvent(new CustomEvent('authReady'));
            }
        } catch (err) {
            addLoginButton();
            updateCartBadge();
            updateWishlistBadge();
            window.dispatchEvent(new CustomEvent('authReady'));
        }
    }

    function addLoginButton() {
        const profileBtn = document.getElementById('profileBtn');
        if (!profileBtn) return;
        if (document.getElementById('loginBtn')) return;

        const loginBtn = document.createElement('a');
        loginBtn.href = `${BASE}Auth/login.html`;
        loginBtn.className = 'login-btn';
        loginBtn.id = 'loginBtn';
        loginBtn.title = 'تسجيل الدخول';
        loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i>`;
        profileBtn.parentElement.appendChild(loginBtn);
    }

    function setupNavSearch() {
        const form = document.getElementById('navSearchForm');
        const input = document.getElementById('navSearchInput');
        if (!form || !input) return;

        const urlParams = new URLSearchParams(window.location.search);
        const currentQ = urlParams.get('q');
        if (currentQ) input.value = currentQ;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = input.value.trim();
            if (!query) {
                window.location.href = `${BASE}Pages/products.html`;
                return;
            }
            window.location.href = `${BASE}Pages/search-results.html?q=${encodeURIComponent(query)}`;
        });
    }

    function init() {
        buildNavbar();
        setActiveLink();
        if (window.getCart) updateCartBadge();
        else setTimeout(updateCartBadge, 100);
        
        updateWishlistBadge();
        checkAuth();
        setupNavSearch();

        window.addEventListener('cartUpdated', updateCartBadge);
        window.addEventListener('wishlistUpdated', updateWishlistBadge);
        window.addEventListener('wishlistReady', updateWishlistBadge);

        window.addEventListener('storage', function(e) {
            if (e.key && e.key.startsWith('cart')) updateCartBadge();
            if (e.key && e.key.startsWith('wishlist')) updateWishlistBadge();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();