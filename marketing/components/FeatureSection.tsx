import React from "react";
import { Link } from "react-router-dom";
import {
  BedIcon,
  BathIcon,
  AreaIcon,
  ShareIcon,
  HeartIcon,
} from "./icons/Icons";
import type { Property } from "@/types";
import type { Language } from "../App";
import { translations } from "../data/translations";
import { useFavorites } from "./shared/FavoritesContext";

interface FeatureSectionProps extends Property {
  language: Language;
}

const FeatureSection: React.FC<FeatureSectionProps> = (props) => {
  const {
    id,
    imageUrl,
    status,
    price,
    title,
    bedrooms,
    bathrooms,
    area,
    language,
  } = props;

  const t = translations[language];
  const { isFavorite, toggleFavorite } = useFavorites();

  // استخدام القيم الافتراضية إذا كانت البيانات غير متوفرة
  const displayStatus = status || "للبيع";
  const displayBedrooms = bedrooms !== undefined ? bedrooms : 0;
  const displayBathrooms = bathrooms !== undefined ? bathrooms : 0;
  const displayArea = area !== undefined ? area : 0;

  // التحقق من حالة العقار بكل اللغات الممكنة
  const isForSale =
    (displayStatus as any) === "For Sale" || displayStatus === "للبيع";
  const isFav = isFavorite(id?.toString());

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id?.toString());
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const baseUrl = window.location.href.split("#")[0];
    const propertyUrl = `${baseUrl}#/properties/${id}`;
    const shareData = {
      title: title,
      text: `${title} - ${price}`,
      url: propertyUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(propertyUrl);
        alert(t.sharing?.linkCopied || "تم نسخ الرابط");
      } catch (err) {
        console.error("Failed to copy:", err);
        alert(t.sharing?.shareFailed || "فشل المشاركة");
      }
    }
  };

  // دالة مساعدة لعرض حالة العقار باللغة المناسبة
  const getStatusDisplay = () => {
    if ((displayStatus as any) === "For Sale" || displayStatus === "للبيع") {
      return language === "ar" ? "للبيع" : "For Sale";
    } else {
      return language === "ar" ? "للإيجار" : "For Rent";
    }
  };

  return (
    <Link to={`/properties/${id}`} className="block h-full">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group h-full flex flex-col">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
          <span
            className={`absolute top-4 ${
              language === "ar" ? "right-4" : "left-4"
            } text-white font-semibold px-3 py-1 rounded-md text-sm ${
              isForSale ? "bg-green-600" : "bg-sky-600"
            }`}
          >
            {getStatusDisplay()}
          </span>
          <div
            className={`absolute top-4 ${
              language === "ar" ? "left-4" : "right-4"
            } flex gap-2`}
          >
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
              aria-label={
                isFav
                  ? t.favoritesPage?.removeFromFavorites
                  : t.favoritesPage?.addToFavorites
              }
            >
              <HeartIcon
                className={`w-6 h-6 transition-colors ${
                  isFav ? "text-red-500 fill-current" : "text-white"
                }`}
              />
            </button>
            {/* <button
              onClick={handleShareClick}
              className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
              aria-label={t.sharing?.share}
            >
              <ShareIcon className="w-6 h-6 text-white" />
            </button> */}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-2xl font-bold text-amber-500 mb-2">{price}</p>
          <h3 className="text-lg font-bold text-gray-100 truncate mb-4 group-hover:text-amber-500 transition-colors flex-grow">
            {title}
          </h3>
          <div className="flex justify-between items-center text-gray-400 border-t border-gray-700 pt-4 mt-auto">
            <div className="flex items-center gap-2">
              <BedIcon className="w-5 h-5 text-gray-500" />
              <span>
                {displayBedrooms}{" "}
                {t.propertyCard?.beds || (language === "ar" ? "غرف" : "Beds")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BathIcon className="w-5 h-5 text-gray-500" />
              <span>
                {displayBathrooms}{" "}
                {t.propertyCard?.baths ||
                  (language === "ar" ? "حمامات" : "Baths")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AreaIcon className="w-5 h-5 text-gray-500" />
              <span>
                {displayArea}{" "}
                {t.propertyCard?.area || (language === "ar" ? "م²" : "m²")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureSection;
