/* ==================== shared/notifications.js ====================
   Injects the notification button into the responsive navbar.
=============================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const wrapper =
            document.getElementById('notifContainer');

        if (!wrapper || document.getElementById('notifBtn')) {
            return;
        }

        let supabaseClient = null;

        try {
            if (typeof window.getSupabase === 'function') {
                supabaseClient = window.getSupabase();
            }
        } catch (error) {
            console.warn('تعذر تهيئة الإشعارات:', error);
        }

        // Create the notification button and dropdown.
        wrapper.innerHTML = `
            <button
                type="button"
                id="notifBtn"
                class="notif-bell"
                aria-label="الإشعارات"
                aria-haspopup="true"
                aria-expanded="false">

                <i class="fas fa-bell" aria-hidden="true"></i>

                <span
                    class="notif-badge"
                    id="notifBadge"
                    style="display:none">0</span>

            </button>

            <div
                class="notif-dropdown"
                id="notifDropdown"
                role="dialog"
                aria-label="الإشعارات">

                <div class="notif-header">

                    <h4>الإشعارات</h4>

                    <button
                        type="button"
                        id="markAllRead">
                        تحديد الكل كمقروء
                    </button>

                </div>

                <div class="notif-list" id="notifList">

                    <div
                        style="
                            text-align:center;
                            padding:20px;
                            color:rgba(255,255,255,.5);
                            font-size:12px;
                        ">
                        جاري تحميل الإشعارات...
                    </div>

                </div>

            </div>
        `;

        const button =
            document.getElementById('notifBtn');

        const dropdown =
            document.getElementById('notifDropdown');

        const markAllReadButton =
            document.getElementById('markAllRead');

        const list =
            document.getElementById('notifList');

        let currentNotifications = [];

        // Open and close the notifications menu.
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const isOpen =
                dropdown.classList.toggle('show');

            button.setAttribute(
                'aria-expanded',
                String(isOpen)
            );
        });

        // Close the dropdown when clicking outside it.
        document.addEventListener('click', function (event) {
            if (!wrapper.contains(event.target)) {
                dropdown.classList.remove('show');

                button.setAttribute(
                    'aria-expanded',
                    'false'
                );
            }
        });

        // Escape HTML before inserting database content.
        function escapeHTML(value) {
            return String(value ?? '').replace(
                /[&<>"']/g,
                function (char) {
                    return {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#39;'
                    }[char];
                }
            );
        }

        // Render notifications and update the unread badge.
        function renderNotifications() {
            const badge =
                document.getElementById('notifBadge');

            if (!list || !badge) return;

            const unreadCount =
                currentNotifications.filter(
                    item => !item.is_read
                ).length;

            badge.textContent =
                unreadCount > 99
                    ? '99+'
                    : String(unreadCount);

            badge.style.display =
                unreadCount > 0
                    ? 'flex'
                    : 'none';

            // Empty state.
            if (!currentNotifications.length) {
                list.innerHTML = `
                    <div
                        style="
                            text-align:center;
                            padding:22px 12px;
                            color:rgba(255,255,255,.48);
                            font-size:12px;
                        ">
                        لا توجد إشعارات حاليًا
                    </div>
                `;

                return;
            }

            // Build the notification list.
            list.innerHTML = currentNotifications.map(
                function (item) {
                    const isSuccess =
                        item.type === 'success';

                    const icon = isSuccess
                        ? 'fa-circle-check'
                        : 'fa-circle-info';

                    const color = isSuccess
                        ? '#6bcb77'
                        : '#00cec9';

                    const date = item.created_at
                        ? new Date(
                            item.created_at
                        ).toLocaleDateString(
                            'ar-EG',
                            {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }
                        )
                        : '';

                    return `
                        <div
                            class="notif-item"
                            data-id="${escapeHTML(item.id)}"
                            style="
                                background:${
                                    item.is_read
                                        ? 'transparent'
                                        : 'rgba(255,255,255,.05)'
                                };
                                opacity:${
                                    item.is_read ? '.68' : '1'
                                };
                            ">

                            <div
                                style="
                                    color:${color};
                                    font-size:18px;
                                    margin-top:2px;
                                ">
                                <i
                                    class="fas ${icon}"
                                    aria-hidden="true"></i>
                            </div>

                            <div style="flex:1;min-width:0">

                                <h5
                                    style="
                                        color:#fff;
                                        font-size:13px;
                                        margin:0 0 4px;
                                        font-weight:700;
                                    ">
                                    ${escapeHTML(item.title)}
                                </h5>

                                <p
                                    style="
                                        color:rgba(255,255,255,.65);
                                        font-size:12px;
                                        margin:0;
                                        overflow-wrap:anywhere;
                                    ">
                                    ${escapeHTML(item.message)}
                                </p>

                                <span
                                    style="
                                        color:rgba(255,255,255,.35);
                                        font-size:10px;
                                        margin-top:6px;
                                        display:block;
                                    ">
                                    ${escapeHTML(date)}
                                </span>

                            </div>

                        </div>
                    `;
                }
            ).join('');

            // Mark an individual notification as read.
            list.querySelectorAll('.notif-item').forEach(
                function (element) {
                    element.addEventListener(
                        'click',
                        async function () {
                            const item =
                                currentNotifications.find(
                                    entry =>
                                        String(entry.id) ===
                                        String(element.dataset.id)
                                );

                            if (
                                !item ||
                                item.is_read ||
                                !item.user_id ||
                                !supabaseClient
                            ) {
                                return;
                            }

                            try {
                                const { error } =
                                    await supabaseClient
                                        .from('Notifications')
                                        .update({
                                            is_read: true
                                        })
                                        .eq('id', item.id);

                                if (error) throw error;

                                item.is_read = true;

                                renderNotifications();
                            } catch (error) {
                                console.warn(
                                    'تعذر تحديث الإشعار:',
                                    error
                                );
                            }
                        }
                    );
                }
            );
        }

        // Handle missing Supabase configuration.
        if (
            !supabaseClient ||
            !supabaseClient.auth
        ) {
            list.innerHTML = `
                <div
                    style="
                        text-align:center;
                        padding:22px 12px;
                        color:rgba(255,255,255,.48);
                        font-size:12px;
                    ">
                    الإشعارات غير متاحة حاليًا
                </div>
            `;

            markAllReadButton.disabled = true;
            markAllReadButton.style.opacity = '.5';
            markAllReadButton.style.cursor = 'not-allowed';

            return;
        }

        // Load the latest notifications from Supabase.
        async function loadNotifications() {
            try {
                const {
                    data: { session } = {}
                } = await supabaseClient.auth.getSession();

                const userId = session?.user?.id;

                let query = supabaseClient
                    .from('Notifications')
                    .select('*')
                    .order('created_at', {
                        ascending: false
                    })
                    .limit(20);

                // Show public notifications and the current user's
                // notifications.
                query = userId
                    ? query.or(
                        `user_id.is.null,user_id.eq.${userId}`
                    )
                    : query.is('user_id', null);

                const { data, error } = await query;

                if (error) throw error;

                currentNotifications =
                    Array.isArray(data) ? data : [];

                renderNotifications();
            } catch (error) {
                console.warn(
                    'فشل تحميل الإشعارات:',
                    error
                );

                list.innerHTML = `
                    <div
                        style="
                            text-align:center;
                            padding:22px 12px;
                            color:rgba(255,255,255,.48);
                            font-size:12px;
                        ">
                        تعذر تحميل الإشعارات الآن
                    </div>
                `;
            }
        }

        // Mark all notifications belonging to the current user as read.
        markAllReadButton.addEventListener(
            'click',
            async function () {
                try {
                    const {
                        data: { session } = {}
                    } = await supabaseClient.auth.getSession();

                    const userId = session?.user?.id;

                    if (!userId) {
                        if (window.showToast) {
                            window.showToast(
                                'سجّل الدخول لتحديث إشعارات حسابك',
                                'info'
                            );
                        }

                        return;
                    }

                    const { error } =
                        await supabaseClient
                            .from('Notifications')
                            .update({
                                is_read: true
                            })
                            .eq('user_id', userId)
                            .eq('is_read', false);

                    if (error) throw error;

                    currentNotifications.forEach(
                        function (item) {
                            if (item.user_id === userId) {
                                item.is_read = true;
                            }
                        }
                    );

                    renderNotifications();

                    if (window.showToast) {
                        window.showToast(
                            'تم تحديد الإشعارات كمقروءة',
                            'success'
                        );
                    }
                } catch (error) {
                    console.warn(
                        'تعذر تحديث الإشعارات:',
                        error
                    );

                    if (window.showToast) {
                        window.showToast(
                            'حصل خطأ أثناء تحديث الإشعارات',
                            'error'
                        );
                    }
                }
            }
        );

        // Listen for new notifications in real time.
        function listenToRealtime() {
            supabaseClient
                .channel('public:Notifications-responsive-navbar')

                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'Notifications'
                    },
                    function (payload) {
                        const newNotification = payload.new;

                        supabaseClient.auth
                            .getSession()
                            .then(function ({
                                data: { session } = {}
                            }) {
                                const userId =
                                    session?.user?.id;

                                if (
                                    newNotification.user_id === null ||
                                    newNotification.user_id === userId
                                ) {
                                    currentNotifications.unshift(
                                        newNotification
                                    );

                                    currentNotifications =
                                        currentNotifications.slice(0, 20);

                                    renderNotifications();

                                    if (window.showToast) {
                                        window.showToast(
                                            `إشعار جديد: ${
                                                newNotification.title || ''
                                            }`,
                                            'info'
                                        );
                                    }
                                }
                            })
                            .catch(error => {
                                console.warn(
                                    'تعذر التحقق من جلسة الإشعارات:',
                                    error
                                );
                            });
                    }
                )

                .subscribe();
        }

        // Start loading and listening.
        loadNotifications();

        listenToRealtime();
    });
})();