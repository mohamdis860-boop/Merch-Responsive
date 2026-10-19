/* ==================== shared/footer.js ==================== */

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

    function injectScrollFixCSS() {
        if (document.querySelector('link[data-scroll-fix-css]')) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = BASE + 'shared/scroll-fix.css';
        link.setAttribute('data-scroll-fix-css', 'true');
        document.head.appendChild(link);
    }

    function injectThemeCSS() {
        if (document.querySelector('link[data-theme-css]')) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = BASE + 'shared/theme.css';
        link.setAttribute('data-theme-css', 'true');
        document.head.appendChild(link);
    }

    function injectCompareCSS() {
        if (document.querySelector('link[data-compare-css]')) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = BASE + 'shared/compare-bar.css';
        link.setAttribute('data-compare-css', 'true');
        document.head.appendChild(link);
    }

    function injectScrollFixInline() {
        if (document.querySelector('style[data-scroll-fix-inline]')) return;

        const style = document.createElement('style');
        style.setAttribute('data-scroll-fix-inline', 'true');
        style.textContent = `
            html {
                background-color: #0a0a1a !important;
                overscroll-behavior: none;
            }
            body {
                background-color: #0a0a1a !important;
                background-attachment: fixed;
                overscroll-behavior: none;
            }
            @media (max-width: 768px) {
                body {
                    background-image: none !important;
                    background-attachment: scroll !important;
                }
            }
            html[data-theme="light"] {
                background-color: #f8fafc !important;
            }
            html[data-theme="light"] body {
                background-color: #f8fafc !important;
            }
        `;
        document.head.appendChild(style);
    }

    function injectThemeJS() {
        if (document.querySelector('script[data-theme-js]')) return;

        const script = document.createElement('script');
        script.src = BASE + 'shared/theme.js';
        script.setAttribute('data-theme-js', 'true');
        script.async = false;
        document.body.appendChild(script);
    }

    function injectWishlistJS() {
        if (document.querySelector('script[data-wishlist-js]')) return;

        const script = document.createElement('script');
        script.src = BASE + 'shared/wishlist.js';
        script.setAttribute('data-wishlist-js', 'true');
        script.async = false;
        document.body.appendChild(script);
    }

    function injectCompareJS() {
        if (document.querySelector('script[data-compare-js]')) return;

        const s1 = document.createElement('script');
        s1.src = BASE + 'shared/compare.js';
        s1.setAttribute('data-compare-js', 'true');
        s1.async = false;
        document.body.appendChild(s1);

        s1.onload = () => {
            const s2 = document.createElement('script');
            s2.src = BASE + 'shared/compare-bar.js';
            s2.async = false;
            document.body.appendChild(s2);
        };
    }

    function buildFooter() {
        if (document.querySelector('.footer-main')) return;

        const oldFooter = document.querySelector('.footer:not(.footer-main)');
        if (oldFooter) oldFooter.remove();

        const footer = document.createElement('footer');
        footer.className = 'footer-main';
        footer.innerHTML = `
            <div class="footer-container">

                <div class="footer-brand">
                    <a href="${BASE}index.html" class="footer-logo">
                        <i class="fas fa-store"></i>
                        متجرنا
                    </a>
                    <p>
                        متجرك الإلكتروني الموثوق — منتجات أصلية، أسعار منافسة،
                        وتوصيل سريع لجميع المحافظات.
                    </p>
                </div>

                <div class="footer-col">
                    <h4>روابط سريعة</h4>
                    <ul>
                        <li><a href="${BASE}index.html">الرئيسية</a></li>
                        <li><a href="${BASE}Pages/products.html">المنتجات</a></li>
                        <li><a href="${BASE}Pages/categories.html">التصنيفات</a></li>
                        <li><a href="${BASE}Pages/about.html">تعرف علينا</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>خدمة العملاء</h4>
                    <ul>
                        <li><a href="${BASE}Pages/contact.html">تواصل معنا</a></li>
                        <li><a href="${BASE}Pages/order-tracking.html">تتبع الطلب</a></li>
                        <li><a href="${BASE}Support/faq.html">الأسئلة الشائعة</a></li>
                        <li><a href="${BASE}Support/terms.html">الشروط والأحكام</a></li>
                        <li><a href="${BASE}Support/privacy.html">سياسة الخصوصية</a></li>
                    </ul>
                </div>

                <div class="footer-col footer-contact">
                    <h4>تواصل معنا</h4>
                    <ul>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:mohamdis860@gmail.com">mohamdis860@gmail.com</a>
                        </li>
                        <li>
                            <i class="fas fa-phone"></i>
                            <a href="tel:01026106479" dir="ltr">0102 610 6479</a>
                        </li>
                        <li>
                            <i class="fas fa-location-dot"></i>
                            <span>فيصل، الجيزة</span>
                        </li>
                        <li>
                            <i class="fas fa-clock"></i>
                            <span>يومياً — 12 ساعة</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="footer-bottom">
                <p>
                    &copy; <span id="footerYear"></span> متجرنا — جميع الحقوق محفوظة
                </p>
                <p>
                    صُنع بـ <span class="heart">❤</span> في مصر
                </p>
            </div>
        `;

        document.body.appendChild(footer);

        const yearEl = document.getElementById('footerYear');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    function buildBackToTop() {
        if (document.querySelector('.back-to-top')) return;

        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'العودة لأعلى الصفحة');
        btn.innerHTML = `
            <svg class="progress-ring" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="25"></circle>
            </svg>
            <i class="fas fa-arrow-up"></i>
        `;

        document.body.appendChild(btn);

        const toggleBtn = () => {
            const scrolled = window.scrollY;
            const threshold = 300;

            btn.classList.toggle('show', scrolled > threshold);

            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;
            const circumference = 2 * Math.PI * 25;

            const circle = btn.querySelector('.progress-ring circle');
            if (circle) {
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference * (1 - progress);
            }
        };

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', toggleBtn, { passive: true });
        window.addEventListener('resize', toggleBtn, { passive: true });

        toggleBtn();
    }

    function init() {
        injectScrollFixInline();
        injectScrollFixCSS();

        injectThemeCSS();
        injectCompareCSS();

        buildFooter();
        buildBackToTop();

        injectThemeJS();
        injectWishlistJS();
        injectCompareJS();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ Footer + Back to Top + Theme + Compare + Scroll Fix + Wishlist loaded');
})();