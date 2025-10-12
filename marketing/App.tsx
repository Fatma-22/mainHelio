import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddPropertyModal from "./components/AddPropertyModal";
import HomePage from "./components/HomePage";
import PropertiesPage from "./components/PropertiesPage";
import PropertiesMapPage from "./components/PropertiesMapPage";
import PropertyDetailsPage from "./components/PropertyDetailsPage";
import FinishingPage from "./components/FinishingPage";
import DecorationsPage from "./components/DecorationsPage";
import ContactPage from "./components/ContactPage";
import FavoritesPage from "./components/FavoritesPage";
import ScrollToTop from "./components/ScrollToTop";
import QuietZone from "./components/QuietZone";
import { FavoritesProvider } from "./components/shared/FavoritesContext";
import { SiteContent, Property } from "./types";
import {
  getSiteContent,
  getSiteContentEn,
} from "./services/siteContentService";
import { getFeaturedProperties } from "./services/propertyService";
import AlertManager from "./components/AlertManager";

export type Language = "ar" | "en";

interface AppData {
  siteContentAr: SiteContent | null;
  siteContentEn: SiteContent | null;
  featuredProperties: Property[];
}

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuietZoneActive, setIsQuietZoneActive] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");
  const [appData, setAppData] = useState<AppData>({
    siteContentAr: null,
    siteContentEn: null,
    featuredProperties: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    // جلب البيانات مرة واحدة عند تحميل التطبيق
    const fetchAppData = async () => {
      try {
        setLoading(true);
        const [arContent, enContent, properties] = await Promise.all([
          getSiteContent(),
          getSiteContentEn(),
          getFeaturedProperties(),
        ]);

        setAppData({
          siteContentAr: arContent,
          siteContentEn: enContent,
          featuredProperties: properties,
        });
      } catch (error) {
        console.error("Error fetching app data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppData();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <FavoritesProvider>
      <div className="bg-gray-900 text-gray-200 flex flex-col min-h-screen">
        <ScrollToTop />
        <Header
          onAddPropertyClick={() => setIsModalOpen(true)}
          onToggleQuietZone={() => setIsQuietZoneActive(true)}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  language={language}
                  siteContentAr={appData.siteContentAr}
                  siteContentEn={appData.siteContentEn}
                  featuredProperties={appData.featuredProperties}
                  isLoading={loading}
                />
              }
            />
            <Route
              path="/properties"
              element={
                <PropertiesPage
                  language={language}
                  onAddPropertyClick={() => setIsModalOpen(true)}
                />
              }
            />
            <Route
              path="/map"
              element={<PropertiesMapPage language={language} />}
            />
            <Route
              path="/properties/:propertyId"
              element={<PropertyDetailsPage language={language} />}
            />
            <Route
              path="/finishing"
              element={<FinishingPage language={language} />}
            />
            <Route
              path="/decoration"
              element={<DecorationsPage language={language} />}
            />
            <Route
              path="/contact"
              element={
                <ContactPage
                  language={language}
                  siteContentAr={appData.siteContentAr}
                  siteContentEn={appData.siteContentEn}
                />
              }
            />
            <Route
              path="/favorites"
              element={<FavoritesPage language={language} />}
            />
          </Routes>
        </main>
        <Footer
          language={language}
          siteContentAr={appData.siteContentAr}
          siteContentEn={appData.siteContentEn}
        />
        {isModalOpen && (
          <AddPropertyModal
            onClose={() => setIsModalOpen(false)}
            language={language}
          />
        )}
        {isQuietZoneActive && (
          <QuietZone
            onClose={() => setIsQuietZoneActive(false)}
            language={language}
          />
        )}
        {/* <Chatbot language={language} /> */}
        <AlertManager position="top-center" language={language} />
      </div>
    </FavoritesProvider>
  );
};

export default App;
