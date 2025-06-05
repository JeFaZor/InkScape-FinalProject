import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false, // כבה debug עכשיו שזה עובד

        fallbackLng: 'en',
        supportedLngs: ['en', 'he'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },

        // הוספת resources ישירות כגיבוי - עם כל התרגומים
        resources: {
            en: {
                translation: {
                    "navbar": {
                        "home": "Home",
                        "about": "About",
                        "contact": "Contact",
                        "search": "Search",
                        "signUp": "Sign Up",
                        "logIn": "Log In",
                        "signOut": "Sign Out",
                        "dashboard": "Dashboard"
                    },
                    "hero": {
                        "title": "Find Your Perfect Tattoo Artist",
                        "subtitle": "Discover talented tattoo artists based on their unique styles and specialties. Search by location or explore the map to find the perfect match for your next tattoo."
                    },
                    "search": {
                        "placeholder": "Search for tattoo artist by name or style...",
                        "style": "Style",
                        "location": "Location",
                        "tags": "Tags",
                        "clearFilters": "Clear Filters",
                        "searchArtists": "Search Artists",
                        "searching": "Searching...",
                        "aiImageAnalysis": "Find Artists Using AI Image Analysis",
                        "uploadDescription": "Upload a tattoo image and our AI will analyze its style to find artists who specialize in similar work",
                        "or": "or",
                        "setLocation": "Set your location",
                        "searchLocation": "Search location...",
                        "currentLocation": "Current location",
                        "searchRadius": "Search radius", 
                        "confirmLocation": "Confirm location"
                    }
                }
            },
            he: {
                translation: {
                    "navbar": {
                        "home": "בית",
                        "about": "אודות",
                        "contact": "צור קשר",
                        "search": "חיפוש",
                        "signUp": "הירשם",
                        "logIn": "התחבר",
                        "signOut": "התנתק",
                        "dashboard": "לוח בקרה"
                    },
                    "hero": {
                        "title": "מצא את המקעקע המושלם עבורך",
                        "subtitle": "גלה מקעקעים מוכשרים לפי הסגנונות וההתמחויות הייחודיות שלהם, חפש לפי מיקום וסגנון כדי למצוא את ההתאמה המושלמת לקעקוע הבא שלך."
                    },
                    "search": {
                        "placeholder": "חפש מקעקע לפי שם או סגנון...",
                        "style": "סגנון",
                        "location": "מיקום",
                        "tags": "תגיות",
                        "clearFilters": "נקה מסננים",
                        "searchArtists": "חיפוש אמנים",
                        "searching": "מחפש...",
                        "aiImageAnalysis": "מצא מקעקעים באמצעות ניתוח תמונה בבינה מלאכותית",
                        "uploadDescription": "העלה תמונת קעקוע והבינה המלאכותית שלנו תנתח את הסגנון כדי למצוא מקעקעים המתמחים בעבודה דומה",
                        "or": "או",
                        "setLocation": "הגדרת מיקום",
                        "searchLocation": "חפש מיקום...",
                        "currentLocation": "מיקום נוכחי",  
                        "searchRadius": "רדיוס חיפוש",
                        "confirmLocation": "אשר מיקום"
                    }
                }
            }
        }
    });

    

// טעינת Roboto רק לעברית
const loadRobotoForHebrew = () => {
    if (!document.querySelector('#roboto-hebrew-font')) {
        const link = document.createElement('link');
        link.id = 'roboto-hebrew-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
        document.head.appendChild(link);
    }

    // הוספת CSS רק לעברית
    if (!document.querySelector('#hebrew-font-style')) {
        const style = document.createElement('style');
        style.id = 'hebrew-font-style';
        style.textContent = `
      [lang="he"] * {
  font-family: 'Roboto', Arial, sans-serif !important;
}
[lang="he"] .hero17-text7 {
  direction: rtl !important;
  text-align: right !important;
}
    `;
        document.head.appendChild(style);
    }
};

// טען את הגופן לעברית
loadRobotoForHebrew();

// בדוק אם השפה כבר עברית בעת הטעינה
if (i18n.language === 'he') {
    document.documentElement.lang = 'he';
    loadRobotoForHebrew();
  }

// רק עדכון שפה וגופן לעברית
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;

    // הוסף את הגופן רק לעברית
    if (lng === 'he') {
        loadRobotoForHebrew();
    }

    console.log(`Language changed to: ${lng}`);
});

export default i18n;