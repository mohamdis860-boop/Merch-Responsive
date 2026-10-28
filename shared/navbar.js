/* ==================== shared/navbar.js ====================
   Responsive desktop + mobile navigation for Merch.
   Keeps the existing cart, wishlist, authentication and search behavior.
=========================================================== */

(function () {
    'use strict';

    function getBasePath() {
        const path = window.location.pathname;

        if (
            path.includes('/Pages/') ||
            path.includes('/Auth/') ||
            path.includes('/Support/')
        ) {
            return '../';
        }

        return '';
    }

    const BASE = getBasePath();

    function buildNavbar() {
        if (document.querySelector('.navbar')) return;

        const nav = document.createElement('nav');

        nav.className = 'navbar';
        nav.setAttribute('aria-label', 'التنقل الرئيسي');

        nav.innerHTML = `
            <div class="navbar-shell">

                <div class="navbar-top">

                    <!-- Logo -->
                    <a href="${BASE}index.html"
                       class="logo"
                       aria-label="متجرنا - الرئيسية">

                        <span class="logo-mark">
                            <i class="fas fa-store" aria-hidden="true"></i>
                        </span>

                        <span class="logo-label">متجرنا</span>

                    </a>

                    <!-- Desktop Navigation -->
                    <div class="nav-primary-links" aria-label="روابط المتجر">

                        <a href="${BASE}index.html" data-nav="home">
                            <i class="fas fa-house" aria-hidden="true"></i>
                            <span>الرئيسية</span>
                        </a>

                        <a href="${BASE}Pages/products.html" data-nav="products">
                            <i class="fas fa-box-open" aria-hidden="true"></i>
                            <span>المنتجات</span>
                        </a>

                        <a href="${BASE}Pages/categories.html" data-nav="categories">
                            <i class="fas fa-layer-group" aria-hidden="true"></i>
                            <span>التصنيفات</span>
                        </a>

                        <a href="${BASE}Pages/about.html" data-nav="about">
                            <i class="fas fa-circle-info" aria-hidden="true"></i>
                            <span>تعرف علينا</span>
                        </a>

                    </div>

                    <!-- Navbar Actions -->
                    <div class="nav-actions" aria-label="إجراءات المتجر">

                        <!-- Desktop Search -->
                        <form
                            class="nav-search nav-search-desktop"
                            id="navSearchForm"
                            role="search"
                            autocomplete="off">

                            <i class="fas fa-search search-leading-icon"
                               aria-hidden="true"></i>

                            <input
                                type="search"
                                id="navSearchInput"
                                data-nav-search
                                placeholder="ابحث عن منتج..."
                                aria-label="ابحث عن المنتجات"
                                autocomplete="off">

                            <button type="submit" aria-label="بحث">
                                <i class="fas fa-arrow-left" aria-hidden="true"></i>
                            </button>

                        </form>

                        <!-- Notifications -->
                        <div
                            class="notif-wrapper"
                            id="notifContainer"
                            aria-label="الإشعارات">
                        </div>

                        <!-- Wishlist -->
                        <a
                            href="${BASE}Pages/wishlist.html"
                            class="nav-icon-button wishlist-badge desktop-only"
                            data-nav="wishlist"
                            title="المفضلة"
                            aria-label="المفضلة">

                            <i class="fas fa-heart" aria-hidden="true"></i>

                            <span
                                class="badge-count"
                                data-wishlist-badge
                                style="display:none">0</span>

                        </a>

                        <!-- Shopping Cart -->
                        <a
                            href="${BASE}Pages/cart.html"
                            class="nav-icon-button cart-badge desktop-only"
                            data-nav="cart"
                            title="سلة المشتريات"
                            aria-label="سلة المشتريات">

                            <i class="fas fa-shopping-bag" aria-hidden="true"></i>

                            <span
                                class="badge-count"
                                data-cart-badge
                                style="display:none">0</span>

                        </a>

                        <!-- User Profile -->
                        <a
                            href="${BASE}Auth/profile.html"
                            class="nav-icon-button profile-btn desktop-only"
                            id="profileBtn"
                            data-nav="account"
                            style="display:none"
                            title="حسابي"
                            aria-label="حسابي">

                            <span
                                class="profile-avatar-mini"
                                id="profileAvatarMini">م</span>

                        </a>

                    </div>

                </div>

                <!-- Mobile Search -->
                <form
                    class="nav-search nav-search-mobile"
                    id="mobileNavSearchForm"
                    role="search"
                    autocomplete="off">

                    <i class="fas fa-search search-leading-icon"
                       aria-hidden="true"></i>

                    <input
                        type="search"
                        id="mobileNavSearchInput"
                        data-nav-search
                        placeholder="بتدور على إيه؟"
                        aria-label="ابحث عن المنتجات"
                        autocomplete="off">

                    <button type="submit" aria-label="بحث">
                        <i class="fas fa-arrow-left" aria-hidden="true"></i>
                    </button>

                </form>

            </div>

            <!-- Mobile Bottom Navigation -->
            <div class="mobile-bottom-nav" aria-label="التنقل السريع">

                <!-- Home -->
                <a href="${BASE}index.html"
                   data-nav="home"
                   aria-label="الرئيسية">

                    <i class="fas fa-house" aria-hidden="true"></i>
                    <span>الرئيسية</span>

                </a>

                <!-- Categories -->
                <a href="${BASE}Pages/categories.html"
                   data-nav="categories"
                   aria-label="التصنيفات">

                    <i class="fas fa-layer-group" aria-hidden="true"></i>
                    <span>التصنيفات</span>

                </a>

                <!-- Wishlist -->
                <a href="${BASE}Pages/wishlist.html"
                   class="wishlist-badge"
                   data-nav="wishlist"
                   aria-label="المفضلة">

                    <span class="mobile-nav-icon-wrap">

                        <i class="fas fa-heart" aria-hidden="true"></i>

                        <span
                            class="badge-count"
                            data-wishlist-badge
                            style="display:none">0</span>

                    </span>

                    <span>المفضلة</span>

                </a>

                <!-- Cart -->
                <a href="${BASE}Pages/cart.html"
                   class="cart-badge"
                   data-nav="cart"
                   aria-label="السلة">

                    <span class="mobile-nav-icon-wrap">

                        <i class="fas fa-bag-shopping" aria-hidden="true"></i>

                        <span
                            class="badge-count"
                            data-cart-badge
                            style="display:none">0</span>

                    </span>

                    <span>السلة</span>

                </a>

                <!-- Account -->
                <a href="${BASE}Auth/profile.html"
                   class="mobile-account-link"
                   data-nav="account"
                   aria-label="حسابي">

                    <i class="fas fa-user" aria-hidden="true"></i>

                    <span id="mobileAccountLabel">حسابي</span>

                </a>

            </div>
        `;

        /*
         * Keep the mobile navigation outside the navbar.
         * This helps fixed positioning work correctly.
         */

        const mobileBottomNav = nav.querySelector('.mobile-bottom-nav');

        if (mobileBottomNav) {
            mobileBottomNav.remove();
        }

        document.body.insertBefore(nav, document.body.firstChild);

        if (mobileBottomNav) {
            nav.insertAdjacentElement('afterend', mobileBottomNav);
        }
    }

    // Highlight the current page in the navigation.
    function setActiveLink() {
        const fileName =
            window.location.pathname.split('/').pop() || 'index.html';

        const navMap = {
            'index.html': 'home',
            'splash.html': 'home',

            'products.html': 'products',
            'product-details.html': 'products',

            'categories.html': 'categories',
            'category-products.html': 'categories',

            'about.html': 'about',

            'cart.html': 'cart',
            'checkout.html': 'cart',

            'wishlist.html': 'wishlist',

            'profile.html': 'account',
            'login.html': 'account',
            'register.html': 'account',
            'forgot-password.html': 'account',
            'reset-password.html': 'account'
        };

        const activeNav = navMap[fileName];

        if (!activeNav) return;

        document
            .querySelectorAll(
                `.nav-primary-links [data-nav="${activeNav}"],
                 .mobile-bottom-nav [data-nav="${activeNav}"]`
            )
            .forEach(link => {
                link.classList.add('active');
            });

        // Products pages use Categories as their mobile shortcut.
        if (activeNav === 'products') {
            document
                .querySelectorAll(
                    '.mobile-bottom-nav [data-nav="categories"]'
                )
                .forEach(link => {
                    link.classList.add('active');
                });
        }
    }

    // Update cart and wishlist badges.
    function setBadges(selector, value) {
        document.querySelectorAll(selector).forEach(badge => {
            const count = Math.max(0, Number(value) || 0);

            badge.textContent = count > 99 ? '99+' : String(count);

            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    function updateCartBadge() {
        try {
            const cart =
                typeof window.getCart === 'function'
                    ? window.getCart()
                    : [];

            const totalItems = Array.isArray(cart)
                ? cart.reduce(
                    (sum, item) => sum + (Number(item.quantity) || 0),
                    0
                )
                : 0;

            setBadges('[data-cart-badge]', totalItems);
        } catch (error) {
            setBadges('[data-cart-badge]', 0);
        }
    }

    window.updateCartBadge = updateCartBadge;

    function updateWishlistBadge() {
        try {
            let count = 0;

            if (typeof window.getWishlistCount === 'function') {
                count = window.getWishlistCount();
            } else {
                const wishlist = JSON.parse(
                    localStorage.getItem('wishlist') || '[]'
                );

                count = Array.isArray(wishlist)
                    ? wishlist.length
                    : 0;
            }

            setBadges('[data-wishlist-badge]', count);
        } catch (error) {
            setBadges('[data-wishlist-badge]', 0);
        }
    }

    window.updateWishlistBadge = updateWishlistBadge;

    // Handle mobile account link based on authentication status.
    function updateMobileAccount(isAuthenticated, userName) {
        const accountLink =
            document.querySelector('.mobile-account-link');

        const label =
            document.getElementById('mobileAccountLabel');

        if (!accountLink) return;

        accountLink.href = isAuthenticated
            ? `${BASE}Auth/profile.html`
            : `${BASE}Auth/login.html`;

        accountLink.setAttribute(
            'aria-label',
            isAuthenticated ? 'حسابي' : 'تسجيل الدخول'
        );

        if (label) {
            label.textContent = isAuthenticated ? 'حسابي' : 'دخول';
        }

        const icon = accountLink.querySelector('i');

        if (icon) {
            icon.className = isAuthenticated
                ? 'fas fa-user'
                : 'fas fa-right-to-bracket';
        }

        accountLink.title =
            userName || (isAuthenticated ? 'حسابي' : 'تسجيل الدخول');
    }

    // Check Supabase authentication.
    async function checkAuth() {
        const profileBtn =
            document.getElementById('profileBtn');

        const profileAvatarMini =
            document.getElementById('profileAvatarMini');

        if (!profileBtn) return;

        if (
            !window.supabase ||
            typeof window.getSupabase !== 'function'
        ) {
            updateMobileAccount(false);
            addLoginButton();

            updateCartBadge();
            updateWishlistBadge();

            window.dispatchEvent(new CustomEvent('authReady'));

            return;
        }

        try {
            const supabase = window.getSupabase();

            const {
                data: { session } = {}
            } = await supabase.auth.getSession();

            if (session && session.user) {
                const userName =
                    session.user.user_metadata?.name ||
                    session.user.email?.split('@')[0] ||
                    'مستخدم';

                if (profileAvatarMini) {
                    profileAvatarMini.textContent =
                        userName.charAt(0).toUpperCase();
                }

                profileBtn.style.display = 'flex';

                window.currentUser = session.user;

                updateMobileAccount(true, userName);

                if (window.mergeGuestCart) {
                    window.mergeGuestCart(session.user.id);
                }

                if (window.mergeGuestWishlist) {
                    window.mergeGuestWishlist(session.user.id);
                }
            } else {
                window.currentUser = null;

                profileBtn.style.display = 'none';

                updateMobileAccount(false);
                addLoginButton();
            }
        } catch (error) {
            console.warn('تعذر التحقق من تسجيل الدخول:', error);

            window.currentUser = null;

            profileBtn.style.display = 'none';

            updateMobileAccount(false);
            addLoginButton();
        }

        updateCartBadge();
        updateWishlistBadge();

        window.dispatchEvent(new CustomEvent('authReady'));
    }

    // Display login icon for guests on desktop.
    function addLoginButton() {
        const profileBtn =
            document.getElementById('profileBtn');

        if (
            !profileBtn ||
            document.getElementById('loginBtn')
        ) {
            return;
        }

        const loginBtn = document.createElement('a');

        loginBtn.href = `${BASE}Auth/login.html`;

        loginBtn.className =
            'nav-icon-button login-btn desktop-only';

        loginBtn.id = 'loginBtn';
        loginBtn.title = 'تسجيل الدخول';

        loginBtn.setAttribute(
            'aria-label',
            'تسجيل الدخول'
        );

        loginBtn.innerHTML = `
            <i class="fas fa-right-to-bracket"
               aria-hidden="true"></i>
        `;

        profileBtn.parentElement.appendChild(loginBtn);
    }

    // Handle desktop and mobile search forms.
    function setupNavSearch() {
        const forms =
            document.querySelectorAll('.navbar .nav-search');

        const params =
            new URLSearchParams(window.location.search);

        const currentQuery = params.get('q') || '';

        forms.forEach(form => {
            const input =
                form.querySelector('[data-nav-search]');

            if (!input) return;

            if (currentQuery) {
                input.value = currentQuery;
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();

                const query = input.value.trim();

                if (!query) {
                    window.location.href =
                        `${BASE}Pages/products.html`;

                    return;
                }

                window.location.href =
                    `${BASE}Pages/search-results.html?q=${encodeURIComponent(query)}`;
            });
        });
    }

    // Initialize everything.
    function init() {
        buildNavbar();

        setActiveLink();

        updateCartBadge();
        updateWishlistBadge();

        checkAuth();

        setupNavSearch();

        window.addEventListener(
            'cartUpdated',
            updateCartBadge
        );

        window.addEventListener(
            'wishlistUpdated',
            updateWishlistBadge
        );

        window.addEventListener(
            'wishlistReady',
            updateWishlistBadge
        );

        window.addEventListener('storage', function (event) {
            if (
                event.key &&
                event.key.toLowerCase().includes('cart')
            ) {
                updateCartBadge();
            }

            if (
                event.key &&
                event.key.toLowerCase().includes('wishlist')
            ) {
                updateWishlistBadge();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();