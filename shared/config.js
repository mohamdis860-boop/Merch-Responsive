/* ==================== shared/config.js ==================== */

window.APP_CONFIG = {
    SUPABASE_URL: 'https://cqdgqawjxofbwzcoliut.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGdxYXdqeG9mYnd6Y29saXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjI2NDgsImV4cCI6MjA3OTYzODY0OH0.0HM9teLT_16Cdx_SwQlNj7QguBcVcdunhJ1kcIPq19s',
    STORAGE_BUCKET: 'products'
};

window.getSupabase = function() {
    if (!window.supabase) {
        console.warn('⚠️ Supabase library not loaded yet');
        return null;
    }
    
    if (!window._supabaseClient) {
        window._supabaseClient = window.supabase.createClient(
            window.APP_CONFIG.SUPABASE_URL,
            window.APP_CONFIG.SUPABASE_ANON_KEY
        );
    }
    
    return window._supabaseClient;
};

window.getStorageUrl = function() {
    return `${window.APP_CONFIG.SUPABASE_URL}/storage/v1/object/public/${window.APP_CONFIG.STORAGE_BUCKET}/`;
};

window.getImageUrl = function(imagePath) {
    if (!imagePath || imagePath.trim() === '') return null;
    if (imagePath.startsWith('http')) return imagePath;
    return window.getStorageUrl() + imagePath;
};

console.log('✅ Config loaded');