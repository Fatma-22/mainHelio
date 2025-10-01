import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "./icons/Icons";
import type { Language } from "../App";
import { translations } from "../data/translations";
import { SiteContent } from "../types";

interface HeroProps {
  language: Language;
  siteContent?: SiteContent;
}

const Hero: React.FC<HeroProps> = ({ language, siteContent }) => {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const t = translations[language].hero;

  // Array of background images
  const backgroundImages = [
    "https://onlyhelio.com/images/background.jpg",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    // "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ];

  // تحديد حدود السعر بناءً على التبويب (بيع أو إيجار)
  useEffect(() => {
    if (activeTab === "buy") {
      setPriceRange({ min: 100000, max: 90000000 });
    } else {
      setPriceRange({ min: 1000, max: 90000 });
    }
  }, [activeTab]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, backgroundImages.length]);

  // Navigation functions
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    // استخدام نفس قيم الفلاتر المستخدمة في PropertiesPage
    params.set("status", activeTab === "buy" ? "للبيع" : "للإيجار");

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    if (propertyType !== "all") {
      // استخدام نفس قيم الأنواع المستخدمة في PropertiesPage
      params.set("type", propertyType);
    }

    // إضافة نطاق السعر
    params.set("minPrice", priceRange.min.toString());
    params.set("maxPrice", priceRange.max.toString());

    // الانتقال مباشرة إلى صفحة العقارات مع معايير البحث
    navigate(`/properties?${params.toString()}`);
  };

  // إعادة تعيين نوع العقار عند التبديل بين البيع والإيجار
  const handleTabChange = (tab: "buy" | "rent") => {
    setActiveTab(tab);
    // إذا كان النوع الحالي هو "أرض" والتبديل إلى "إيجار"، أعد التعيين إلى "الكل"
    if (tab === "rent" && propertyType === "land") {
      setPropertyType("all");
    }
  };

  // تنسيق الأرقام لعرضها بشكل مقروء
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // تحديث نطاق السعر بناءً على قيمة الشريط
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // حساب النطاق بناءً على قيمة الشريط (0-100)
    const percentage = value / 100;

    if (activeTab === "buy") {
      const min = 100000;
      const max = 90000000;
      const range = max - min;
      const newMax = min + range * percentage;
      setPriceRange({ min, max: newMax });
    } else {
      const min = 1000;
      const max = 90000;
      const range = max - min;
      const newMax = min + range * percentage;
      setPriceRange({ min, max: newMax });
    }
  };

  // حساب قيمة الشريط بناءً على النطاق الحالي
  const calculateSliderValue = () => {
    if (activeTab === "buy") {
      const min = 100000;
      const max = 90000000;
      const range = max - min;
      const currentRange = priceRange.max - min;
      return (currentRange / range) * 100;
    } else {
      const min = 1000;
      const max = 90000;
      const range = max - min;
      const currentRange = priceRange.max - min;
      return (currentRange / range) * 100;
    }
  };

  // التعامل مع حالة عدم وجود محتوى
  if (!siteContent) {
    return (
      <section className="relative h-[85vh] flex items-center justify-center text-center bg-gray-900">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>t.contentloading</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] flex items-center justify-center text-center text-white ">
      {/* Background Images with Fade Transition */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPreviousImage}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Previous image"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNextImage}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Next image"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Navigation Dots */}
      {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentImageIndex
                ? "bg-amber-500 scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Auto-play Toggle */}
      {/* <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-6 right-6 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200"
        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button> */}
      <div className="relative z-40 px-4 container mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          {siteContent.heroTitle || "بوابتك الحصرية لأرقى العقارات"}
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-10">
          {siteContent.heroSubtitle ||
            "في ONLY HELIO، نختص بتقديم روائع معمارية وخدمات متكاملة مصممة خصيصًا لتلبية طموحات سكان مدينة هليوبوليس الجديدة."}
        </p>

        {/* <div className="w-full max-w-screen-2xl bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-gray-700">
          <div className="flex border-b border-gray-600 mb-6">
            <button
              onClick={() => handleTabChange("buy")}
              className={`px-6 py-2 text-lg font-semibold transition-colors duration-200 ${
                activeTab === "buy"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400"
              }`}
            >
              {t.buy}
            </button>
            <button
              onClick={() => handleTabChange("rent")}
              className={`px-6 py-2 text-lg font-semibold transition-colors duration-200 ${
                activeTab === "rent"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400"
              }`}
            >
              {t.rent}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="all">{t.propertyType}</option>
                <option value="apartment">{t.apartment}</option>
                <option value="villa">{t.villa}</option>
                <option value="commercial">{t.commercial}</option>
                 {activeTab === "buy" && <option value="land">{t.land}</option>}
              </select>
              <div className="bg-gray-700/50 p-4 col-span-2 rounded-lg border border-gray-600">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">
                    {activeTab === "buy" ? t.priceRange : t.rentRange}
                  </span>
                  <div className="text-amber-400 font-semibold">
                    {formatNumber(priceRange.min)} -{" "}
                    {formatNumber(priceRange.max)}
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={calculateSliderValue()}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {formatNumber(activeTab === "buy" ? 100000 : 1000)}
                    </span>
                    <span>
                      {formatNumber(activeTab === "buy" ? 90000000 : 90000)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <SearchIcon className="h-5 w-5" />
                <span>{t.search}</span>
              </button>
            </div>
          </form>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
