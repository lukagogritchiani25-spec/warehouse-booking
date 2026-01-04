import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ka' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
      title={i18n.language === 'en' ? 'ქართული' : 'English'}
    >
      {i18n.language === 'en' ? '🇬🇪 ქარ' : '🇬🇧 ENG'}
    </button>
  );
};

export default LanguageSwitcher;
