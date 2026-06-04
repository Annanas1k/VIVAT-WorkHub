import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
      {['en', 'ro', 'ru'].map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={`px-2.5 py-1 text-xs rounded-md font-medium uppercase transition-colors
            ${i18n.language === lang
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};