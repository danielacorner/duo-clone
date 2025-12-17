import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
];

export default function AccountMenu() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowLangMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setShowLangMenu(false);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition-all"
      >
        👤
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden z-50">
          {!showLangMenu ? (
            <>
              <button
                onClick={() => {}}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-all flex items-center gap-3"
              >
                <span className="text-xl">⚙️</span>
                {t("accountMenu.settings")}
              </button>
              <button
                onClick={() => {}}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-all flex items-center gap-3"
              >
                <span className="text-xl">👤</span>
                {t("accountMenu.profile")}
              </button>
              <button
                onClick={() => setShowLangMenu(true)}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-all flex items-center gap-3 justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  {t("accountMenu.language")}
                </div>
                <span className="text-gray-400">{currentLanguage.flag}</span>
              </button>
              <button
                onClick={() => {}}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-all flex items-center gap-3"
              >
                <span className="text-xl">❓</span>
                {t("accountMenu.help")}
              </button>
              <div className="border-t border-gray-700" />
              <button
                onClick={() => {}}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-700 transition-all flex items-center gap-3"
              >
                <span className="text-xl">🚪</span>
                {t("accountMenu.logout")}
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
                <button
                  onClick={() => setShowLangMenu(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ←
                </button>
                <span className="text-white font-bold">
                  {t("accountMenu.selectLanguage")}
                </span>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-all flex items-center gap-3 ${
                    i18n.language === lang.code
                      ? "bg-gray-700 text-duo-green"
                      : "text-white"
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {i18n.language === lang.code && (
                    <span className="ml-auto text-duo-green">✓</span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
