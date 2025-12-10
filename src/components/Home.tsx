import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-duo-dark to-gray-900">
      <div className="text-center">
        <div className="text-8xl mb-6">🦉</div>
        <h1 className="text-4xl font-bold text-white mb-4">{t("home.title")}</h1>
        <p className="text-gray-400 text-lg mb-8">{t("home.subtitle")}</p>
        <button
          onClick={() => navigate('/learn')}
          className="bg-duo-green hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          {t("home.getStarted")}
        </button>
      </div>
    </div>
  );
}
