(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        
        const supabase = window.getSupabase?.();
        if (!supabase) {
            console.warn('⚠️ Supabase غير متاح');
            return;
        }

        let currentNotifications = [];

        function injectBell() {
            const navLinks = document.querySelector('.navbar .nav-links');
            if (!navLinks) return;

            const bellHTML = `
                <div class="notif-wrapper">
                    <a href="javascript:void(0)" id="notifBtn" class="cart-badge" style="text-decoration: none; color: rgba(255, 255, 255, 0.7); font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px; transition: 0.35s;">
                        <i class="fas fa-bell"></i>
                        <span class="nav-text">الإشعارات</span>
                        <span class="badge-count" id="notifBadge" style="display: none;">0</span>
                    </a>

                    <div class="notif-dropdown" id="notifDropdown">
                        <div class="notif-header">
                            <h4>الإشعارات</h4>
                            <button id="markAllRead">تحديد الكل كمقروء</button>
                        </div>
                        <div class="notif-list" id="notifList">
                            <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.4); font-size: 12px;">جاري التحميل...</div>
                        </div>
                    </div>
                </div>
            `;
            
            navLinks.insertAdjacentHTML('afterbegin', bellHTML);
            
            const bellLink = document.getElementById('notifBtn');
            bellLink.addEventListener('mouseenter', () => bellLink.style.color = '#ff6b6b');
            bellLink.addEventListener('mouseleave', () => bellLink.style.color = 'rgba(255, 255, 255, 0.7)');

            setupEvents();
            loadNotifications();   
            listenToRealtime();    
        }

        async function loadNotifications() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;

                let query = supabase.from('Notifications').select('*').order('created_at', { ascending: false }).limit(20);
                
                if (userId) {
                    query = query.or(`user_id.is.null,user_id.eq.${userId}`);
                } else {
                    query = query.is('user_id', null);
                }

                const { data, error } = await query;
                if (error) throw error;

                currentNotifications = data || [];
                renderNotifications();
            } catch (err) {
                console.warn('⚠️ فشل جلب الإشعارات:', err);
            }
        }

        function renderNotifications() {
            const list = document.getElementById('notifList');
            const badge = document.getElementById('notifBadge');
            if (!list) return;

            const unreadCount = currentNotifications.filter(n => !n.is_read).length;
            
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }

            if (currentNotifications.length === 0) {
                list.innerHTML = `<div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.4); font-size: 12px;">لا توجد إشعارات حالياً</div>`;
                return;
            }

            let html = '';
            currentNotifications.forEach(n => {
                let icon = 'fa-info-circle';
                let color = '#00cec9';
                if (n.type === 'success') { icon = 'fa-check-circle'; color = '#6bcb77'; }

                const date = new Date(n.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                html += `
                    <div class="notif-item" data-id="${n.id}" style="background: ${n.is_read ? 'transparent' : 'rgba(255,255,255,0.05)'}; opacity: ${n.is_read ? '0.6' : '1'};">
                        <div style="color: ${color}; font-size: 18px; margin-top: 2px;"><i class="fas ${icon}"></i></div>
                        <div style="flex: 1;">
                            <h5 style="color: white; font-size: 13px; margin: 0 0 4px 0; font-weight: 700;">${n.title}</h5>
                            <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">${n.message}</p>
                            <span style="color: rgba(255,255,255,0.3); font-size: 10px; margin-top: 6px; display: block;">${date}</span>
                        </div>
                    </div>
                `;
            });

            list.innerHTML = html;
            setupItemClicks();
        }

        function listenToRealtime() {
            supabase
                .channel('public:Notifications')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Notifications' }, payload => {
                    
                    const newNotif = payload.new;
                    supabase.auth.getSession().then(({ data: { session } }) => {
                        const userId = session?.user?.id;
                        if (newNotif.user_id === null || newNotif.user_id === userId) {
                            
                            currentNotifications.unshift(newNotif);
                            renderNotifications();

                            if(window.showToast) window.showToast(`🔔 ${newNotif.title}`, 'info');

                            // new Audio('https://actions.google.com/sounds/v1/alarms/notification.ogg').play().catch(()=>{});
                        }
                    });
                })
                .subscribe();
        }

        function setupEvents() {
            const btn = document.getElementById('notifBtn');
            const dropdown = document.getElementById('notifDropdown');
            const markAllRead = document.getElementById('markAllRead');
            const wrapper = document.querySelector('.notif-wrapper');

            if (!btn) return;

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });

            markAllRead.addEventListener('click', async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user?.id) return;

                await supabase.from('Notifications').update({ is_read: true }).eq('user_id', session.user.id).eq('is_read', false);
                
                currentNotifications.forEach(n => { if(n.user_id) n.is_read = true; });
                renderNotifications();
                if(window.showToast) window.showToast('✅ تم تحديد الكل كمقروء', 'success');
            });
        }

        function setupItemClicks() {
            document.querySelectorAll('.notif-item').forEach(item => {
                item.addEventListener('click', async function() {
                    const id = this.dataset.id;
                    const notif = currentNotifications.find(n => n.id === id);
                    
                    if (notif && !notif.is_read && notif.user_id) {
                        await supabase.from('Notifications').update({ is_read: true }).eq('id', id);
                        notif.is_read = true;
                        renderNotifications();
                    }
                });
            });
        }

        setTimeout(injectBell, 300);
    });
})();