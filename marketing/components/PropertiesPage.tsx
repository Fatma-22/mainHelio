import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import FeatureSection from "./FeatureSection";
import { getProperties } from "../services/propertyService";
import type { Language } from "../App";
import { translations } from "../data/translations";
import { SearchIcon } from "./icons/Icons";
import PropertyCardSkeleton from "./shared/PropertyCardSkeleton";
import { Property } from "@/types";

const inputClasses =
  "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white placeholder-gray-400";
const selectClasses =
  "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white";

interface PropertiesPageProps {
  onAddPropertyClick: () => void;
  language: Language;
}

const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onAddPropertyClick,
  language,
}) => {
  const t = translations[language].propertiesPage;
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [showPriceReset, setShowPriceReset] = useState(false);
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const statusFilter = searchParams.get("status") || "all";
  const typeFilter = searchParams.get("type") || "all";
  const finishFilter = searchParams.get("finish") || "all"; // قراءة فلتر التشطيب من معلمات البحث
  const queryFilter = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const props = await getProperties();
        setProperties(props);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
    const interval = setInterval(fetchProperties, 30000);
    return () => clearInterval(interval);
  }, []);

  // تحديث نطاق السعر بناءً على التبويب والمعلمات
  useEffect(() => {
    const statusFilter = searchParams.get("status") || "all";
    const minPriceFilter = searchParams.get("minPrice") || "";
    const maxPriceFilter = searchParams.get("maxPrice") || "";

    // تحديد التبويب النشط بناءً على معلمة الحالة
    if (statusFilter === "For Sale" || statusFilter === "للبيع") {
      setActiveTab("buy");
    } else if (statusFilter === "For Rent" || statusFilter === "للإيجار") {
      setActiveTab("rent");
    }

    const defaultMin = activeTab === "buy" ? 100000 : 1000;
    const defaultMax = activeTab === "buy" ? 90000000 : 90000;

    const min = minPriceFilter ? parseFloat(minPriceFilter) : defaultMin;
    const max = maxPriceFilter ? parseFloat(maxPriceFilter) : defaultMax;

    setPriceRange({ min, max });
    setShowPriceReset(!!minPriceFilter || !!maxPriceFilter);
  }, [searchParams, activeTab]);

  const handleTabChange = (tab: "buy" | "rent") => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("status", tab === "buy" ? "للبيع" : "للإيجار");

    // عند تغيير التبويب، قم بإعادة تعيين فلتر التشطيب إذا لم يكن مناسبًا
    if (
      tab === "rent" ||
      (tab === "buy" && typeFilter !== "apartment" && typeFilter !== "villa")
    ) {
      newParams.delete("finish");
    }

    setSearchParams(newParams, { replace: true });
  };

  const handleFilterChange = (filterName: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      newParams.delete(filterName);
    } else {
      newParams.set(filterName, value);
    }

    // إذا كان التغيير في نوع العقار، قم بإعادة تعيين فلتر التشطيب إذا لزم الأمر
    if (filterName === "type") {
      if (
        activeTab === "rent" ||
        (value !== "apartment" && value !== "villa")
      ) {
        newParams.delete("finish");
      }
    }

    setSearchParams(newParams, { replace: true });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const percentage = value / 100;

    const defaultMin = activeTab === "buy" ? 100000 : 1000;
    const defaultMax = activeTab === "buy" ? 90000000 : 90000;
    const range = defaultMax - defaultMin;
    const newMax = defaultMin + range * percentage;

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("maxPrice", Math.round(newMax).toString());
    setSearchParams(newParams, { replace: true });
  };

  const calculateSliderValue = () => {
    const defaultMin = activeTab === "buy" ? 100000 : 1000;
    const defaultMax = activeTab === "buy" ? 90000000 : 90000;
    const range = defaultMax - defaultMin;
    const currentRange = priceRange.max - defaultMin;
    return (currentRange / range) * 100;
  };

  const resetPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("minPrice");
    newParams.delete("maxPrice");
    setSearchParams(newParams, { replace: true });
  };

  // دالة جديدة لإعادة تعيين جميع الفلاتر
  const resetAllFilters = () => {
    const newParams = new URLSearchParams();
    // إبقاء حالة التبويب الحالي
    newParams.set("status", activeTab === "buy" ? "للبيع" : "للإيجار");
    setSearchParams(newParams, { replace: true });
  };

  const getPriceNumeric = (price: string): number => {
    const numericValue = parseFloat(price.replace(/[^\d.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const normalizePropertyType = (type: string): string => {
    const typeMap: Record<string, string[]> = {
      apartment: ["شقة", "شقق", "apartment", "flat"],
      villa: ["فيلا", "فيلة", "villa"],
      commercial: ["تجاري", "محل", "مكتب", "commercial"],
      land: ["أرض", "ارض", "land", "plot"],
    };
    for (const [normalizedType, variations] of Object.entries(typeMap)) {
      if (
        variations.some((v) => type.toLowerCase().includes(v.toLowerCase()))
      ) {
        return normalizedType;
      }
    }
    return type.toLowerCase();
  };

  const normalizeFinish = (finish: string | null) => {
    if (!finish) return "all";
    const map: Record<string, string> = {
      "تشطيب كامل": "full",
      "نص تشطيب": "partial",
      "على الطوب": "bare",
      full: "full",
      partial: "partial",
      bare: "bare",
    };
    return map[finish] || "all";
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // دعم العربية والإنجليزية في حالة العقار
      const statusMatch =
        activeTab === "buy"
          ? (p as any)?.status === "For Sale" || (p as any)?.status === "للبيع"
          : (p as any)?.status === "For Rent" ||
            (p as any)?.status === "إيجار" ||
            (p as any)?.status === "للإيجار";

      const normalizedType = normalizePropertyType(p.type);

      // دعم العربية والإنجليزية في نوع العقار
      const typeMatch =
        typeFilter === "all" ||
        normalizedType === typeFilter ||
        (typeFilter === "villa" && normalizedType === "villa") ||
        (typeFilter === "فيلا" && normalizedType === "villa") ||
        (typeFilter === "apartment" && normalizedType === "apartment") ||
        (typeFilter === "شقة" && normalizedType === "apartment") ||
        (typeFilter === "commercial" && normalizedType === "commercial") ||
        (typeFilter === "تجاري" && normalizedType === "commercial") ||
        (typeFilter === "land" && normalizedType === "land") ||
        (typeFilter === "أرض" && normalizedType === "land");

      const priceNumeric = getPriceNumeric(p.price);
      const priceMatch =
        priceNumeric >= priceRange.min && priceNumeric <= priceRange.max;

      const finishMatch =
        finishFilter === "all" || normalizeFinish(p.finish) === finishFilter;

      const queryMatch =
        !queryFilter ||
        p.title.toLowerCase().includes(queryFilter.toLowerCase()) ||
        p.address.toLowerCase().includes(queryFilter.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(queryFilter.toLowerCase()));
      return (
        statusMatch && typeMatch && priceMatch && finishMatch && queryMatch
      );
    });
  }, [
    properties,
    activeTab,
    typeFilter,
    queryFilter,
    finishFilter,
    priceRange,
  ]);

  // const filteredProperties = useMemo(() => {
  //   return properties
  //     ?.filter((p) =>
  //       activeTab === "buy"
  //         ? (p as any)?.status === "For Sale" || p.status === "للبيع"
  //         : (p as any).status === "For Rent" || p.status === "للإيجار"
  //     )
  //     ?.filter((p) => {
  //       const normalizedType = normalizePropertyType(p.type);
  //       return (
  //         typeFilter === "all" ||
  //         normalizedType === typeFilter ||
  //         (typeFilter === "villa" && normalizedType === "villa") ||
  //         (typeFilter === "فيلا" && normalizedType === "villa") ||
  //         (typeFilter === "apartment" && normalizedType === "apartment") ||
  //         (typeFilter === "شقة" && normalizedType === "apartment") ||
  //         (typeFilter === "commercial" && normalizedType === "commercial") ||
  //         (typeFilter === "تجاري" && normalizedType === "commercial") ||
  //         (typeFilter === "land" && normalizedType === "land") ||
  //         (typeFilter === "أرض" && normalizedType === "land")
  //       );
  //     })
  //     ?.filter(
  //       (p) =>
  //         finishFilter === "all" || normalizeFinish(p.finish) === finishFilter
  //     )
  //     ?.filter(
  //       (p) =>
  //         !queryFilter?.trim() ||
  //         p.title.toLowerCase().includes(queryFilter.toLowerCase()) ||
  //         p.address.toLowerCase().includes(queryFilter.toLowerCase()) ||
  //         (p.description &&
  //           p.description.toLowerCase().includes(queryFilter.toLowerCase()))
  //     )
  //     ?.filter((p) => {
  //       const priceNumeric = getPriceNumeric(p.price);

  //       return priceNumeric >= priceRange.min && priceNumeric <= priceRange.max;
  //     });
  // }, [
  //   properties,
  //   activeTab,
  //   typeFilter,
  //   queryFilter,
  //   finishFilter,
  //   priceRange,
  // ]);
  return (
    <div className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-right mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {t.title}
            </h1>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto sm:mx-0">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onAddPropertyClick}
            className="bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 shadow-md shadow-amber-500/20 mt-6 sm:mt-0 flex-shrink-0"
          >
            {translations[language].addProperty}
          </button>
        </div>

        <div className="mb-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
          {/* تبويبات البيع والإيجار */}
          <div className="flex border-b border-gray-600 mb-6">
            <button
              onClick={() => handleTabChange("buy")}
              className={`px-6 py-2 text-lg font-semibold transition-colors duration-200 ${
                activeTab === "buy"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400"
              }`}
            >
              {t.forSale}
            </button>
            <button
              onClick={() => handleTabChange("rent")}
              className={`px-6 py-2 text-lg font-semibold transition-colors duration-200 ${
                activeTab === "rent"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400"
              }`}
            >
              {t.forRent}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                value={queryFilter}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`${inputClasses} ${
                  language === "ar" ? "pr-10" : "pl-10"
                }`}
              />
              <SearchIcon
                className={`absolute top-1/2 -translate-y-1/2 ${
                  language === "ar" ? "right-3" : "left-3"
                } h-5 w-5 text-gray-400`}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className={selectClasses}
            >
              <option value="all">{t.allTypes}</option>
              <option value="apartment">{t.apartment}</option>
              <option value="villa">{t.villa}</option>
              <option value="commercial">{t.commercial}</option>
              {/* عرض خيار الأراضي فقط في حالة البيع */}
              {activeTab === "buy" && <option value="land">{t.land}</option>}
            </select>
            {/* فلتر التشطيب يظهر فقط إذا كان للبيع ومعاها شقة أو فيلا */}
            {activeTab === "buy" &&
              (typeFilter === "apartment" || typeFilter === "villa") && (
                <select
                  value={finishFilter}
                  onChange={(e) => handleFilterChange("finish", e.target.value)}
                  className={selectClasses}
                >
                  <option value="all">{t.allFinishes}</option>
                  <option value="full">{t.fullFinish}</option>
                  <option value="partial">{t.partialFinish}</option>
                  <option value="bare">{t.bareFinish}</option>
                </select>
              )}
          </div>

          {/* شريط تمرير السعر */}
          <div className="mt-6 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">
                {activeTab === "buy" ? t.priceRange : t.rentRange}
              </span>
              <div className="flex items-center gap-4">
                <div className="text-amber-400 font-semibold">
                  {formatNumber(priceRange.min)} -{" "}
                  {formatNumber(priceRange.max)}
                </div>
                {showPriceReset && (
                  <button
                    onClick={resetPriceFilter}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {t.resetPrice}
                  </button>
                )}
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
                <span>{formatNumber(activeTab === "buy" ? 100000 : 1000)}</span>
                <span>
                  {formatNumber(activeTab === "buy" ? 90000000 : 90000)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((prop) => (
              <FeatureSection key={prop.id} {...prop} language={language} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-gray-400 mb-6">{t.noResults}</p>
              <button
                onClick={resetAllFilters}
                className="bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200"
              >
                {t.resetFilters || "عودة لكل النتائج"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
