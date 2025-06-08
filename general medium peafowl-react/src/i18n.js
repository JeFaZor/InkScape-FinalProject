import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false, 

        fallbackLng: 'en',
        supportedLngs: ['en', 'he'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        backend: {
            loadPath: '/{{lng}}/translation.json',
        },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    });

const loadRobotoForHebrew = () => {
    if (!document.querySelector('#roboto-hebrew-font')) {
        const link = document.createElement('link');
        link.id = 'roboto-hebrew-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;700&display=swap';
        document.head.appendChild(link);
    }

    // CSS for Hebrew language only
    if (!document.querySelector('#hebrew-font-style')) {
        const style = document.createElement('style');
        style.id = 'hebrew-font-style';
        style.textContent = `
            [lang="he"] * {
                font-family: 'Assistant', Arial, sans-serif !important;
            }
            
            [lang="he"] .hero17-text7 {
                direction: rtl !important;
                text-align: right !important;
            }
            
            /* Dashboard RTL Support - Global */
            [lang="he"] .dashboard-container {
                direction: rtl;
            }
            
            [lang="he"] .dashboard-grid {
                direction: rtl;
            }
            
            [lang="he"] .dashboard-tabs {
                direction: rtl;
            }
            
            [lang="he"] .dashboard-content {
                direction: rtl;
                text-align: right;
            }
            
            [lang="he"] .dashboard-form-input {
                text-align: right;
                direction: rtl;
            }
            
            [lang="he"] .dashboard-flex-reverse {
                flex-direction: row-reverse;
            }
            
            [lang="he"] .dashboard-text-right {
                text-align: right;
            }
            
            /* Fix for icons in RTL */
            [lang="he"] .dashboard-content .lucide {
                margin-left: 8px;
                margin-right: 0;
            }
            
            /* Fix for button spacing in RTL */
            [lang="he"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
                margin-right: calc(0.75rem * 1);
                margin-left: calc(0.75rem * -1);
            }
            
            /* Dashboard specific RTL fixes */
            [lang="he"] .dashboard-profile-section {
                direction: rtl;
                text-align: right;
            }
            
            [lang="he"] .dashboard-stats-grid {
                direction: rtl;
            }
            
            [lang="he"] .dashboard-portfolio-grid {
                direction: rtl;
            }
            
            /* Input and textarea RTL styling */
            [lang="he"] input[type="text"],
            [lang="he"] input[type="email"],
            [lang="he"] textarea {
                direction: rtl;
                text-align: right;
            }
            
            /* Button icon positioning for RTL */
            [lang="he"] .btn-with-icon {
                flex-direction: row-reverse;
            }
            
            [lang="he"] .btn-with-icon .lucide {
                margin-left: 8px;
                margin-right: 0;
            }
            
            /* Fix for Instagram handle display */
            [lang="he"] .instagram-handle {
                direction: ltr;
                text-align: left;
            }
            
            /* Fix for star rating display */
            [lang="he"] .rating-display {
                flex-direction: row-reverse;
            }
            
            /* Fix for profile completion progress bar */
            [lang="he"] .progress-container {
                direction: ltr;
            }
            
            /* Fix for grid layouts in RTL */
            [lang="he"] .grid-rtl {
                direction: rtl;
            }
            
            /* Fix for tabs navigation */
            [lang="he"] .tabs-navigation {
                direction: rtl;
            }
            
            /* Fix for modal and dropdown positioning */
            [lang="he"] .dropdown-menu {
                left: auto;
                right: 0;
            }
            
            /* General text alignment for RTL */
            [lang="he"] .text-content {
                text-align: right;
                direction: rtl;
            }
            
            /* Fix for flex items with gaps */
            [lang="he"] .flex-gap-rtl {
                flex-direction: row-reverse;
                gap: 0.75rem;
            }
            
            /* Fix for profile image and content alignment */
            [lang="he"] .profile-header {
                direction: rtl;
                text-align: right;
            }
            
            /* Fix for form labels */
            [lang="he"] label {
                text-align: right;
            }
            
            /* Fix for placeholder text */
            [lang="he"] ::placeholder {
                text-align: right;
                direction: rtl;
            }
        `;
        document.head.appendChild(style);
    }
};

// Load font for Hebrew
loadRobotoForHebrew();

// Check if language is already Hebrew on load
if (i18n.language === 'he') {
    document.documentElement.lang = 'he';
    loadRobotoForHebrew();
}

// Update language and font for Hebrew
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;

    // Add font only for Hebrew
    if (lng === 'he') {
        loadRobotoForHebrew();
    }

    console.log(`Language changed to: ${lng}`);
});

export default i18n;