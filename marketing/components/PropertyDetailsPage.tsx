import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProperty } from "../services/propertyService";
import {
  BedIcon,
  BathIcon,
  AreaIcon,
  CheckCircleIcon,
  ShareIcon,
  HeartIcon,
} from "./icons/Icons";
import type { Language } from "../App";
import { translations } from "../data/translations";
import { useFavorites } from "./shared/FavoritesContext";
import { Loader2, Settings } from "lucide-react";
import { Property } from "@/types";
import PropertyVideoGallery from "./PropertyVideoGallery";
import YouTubeVideoPlayer from "./YouTubeVideoPlayer";

interface PropertyDetailsPageProps {
  language: Language;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({
  language = "en",
}) => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const t = translations[language];

  const [property, setProperty] = useState<Property | null | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setProperty(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const prop = await getProperty(propertyId);
      setProperty(prop);
      setMainImage(prop?.imageUrl);
      setIsLoading(false);
    };
    fetchProperty();
  }, [propertyId]);

  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = property ? isFavorite(property?.id?.toString()) : false;

  const handleFavoriteClick = () => {
    if (property) {
      toggleFavorite(property?.id?.toString());
    }
  };

  const handleShare = async () => {
    if (!property) return;

    const baseUrl = window.location.href.split("#")[0];
    const propertyUrl = `${baseUrl}#/properties/${property.id}`;
    const shareData = {
      title: property.title, // تم التعديل هنا
      text: `${property.title} - ${property.price}`, // تم التعديل هنا
      url: propertyUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing property:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(propertyUrl);
        alert(t.sharing?.linkCopied || "تم نسخ الرابط");
      } catch (err) {
        console.error("Failed to copy link:", err);
        alert(t.sharing?.shareFailed || "فشل المشاركة");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="flex items-center justify-center">
          <p className="text-xl text-gray-400 flex items-center gap-2">
            Loading Property Details
            <Loader2 className="size-4 animate-spin" />
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold text-white">
          {t.propertyDetailsPage?.notFoundTitle}
        </h1>
        <p className="text-gray-400 mt-4">
          {t.propertyDetailsPage?.notFoundText}
        </p>
        <Link
          to="/properties"
          className="mt-8 inline-block bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-amber-600"
        >
          {t.propertyDetailsPage?.backButton}
        </Link>
      </div>
    );
  }

  const isForSale =
    (property as any).status === "For Sale" || property.status === "للبيع"; // تم التعديل هنا

  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">{property.title}</h1>{" "}
            {/* تم التعديل هنا */}
            <p className="text-lg text-gray-400 mt-2">
              {property.address}
            </p>{" "}
            {/* تم التعديل هنا */}
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className="flex-shrink-0 flex items-center justify-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
              aria-label={
                isFav
                  ? t.favoritesPage?.removeFromFavorites
                  : t.favoritesPage?.addToFavorites
              }
            >
              <HeartIcon
                className={`w-6 h-6 transition-colors ${
                  isFav ? "text-red-500 fill-current" : ""
                }`}
              />
            </button>
            <button
              onClick={handleShare}
              className="flex-shrink-0 flex items-center justify-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              <ShareIcon className="w-6 h-6" />
              <span>{t.sharing?.shareProperty}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images and Map */}
          <div className="lg:col-span-2">
            {/* Combined Image & Video Gallery */}
            <div className="mb-8">
              <div className="relative mb-4">
                {/* Main image or video */}
                {mainImage &&
                mainImage.startsWith("http") &&
                !mainImage.includes("youtube.com") &&
                !mainImage.includes("youtu.be") ? (
                  <img
                    src={mainImage}
                    alt={property.title}
                    className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                    loading="lazy"
                  />
                ) : mainImage &&
                  (mainImage.includes("youtube.com") ||
                    mainImage.includes("youtu.be")) ? (
                  // If mainImage is a YouTube URL, render the video player
                  (() => {
                    // Try to extract YouTube video ID
                    let videoId = "";
                    try {
                      let url = new URL(mainImage);
                      if (url.hostname.includes("youtube.com")) {
                        const params = new URLSearchParams(url.search);
                        videoId = params.get("v") || "";
                      } else if (url.hostname.includes("youtu.be")) {
                        videoId = url.pathname.replace("/", "");
                      }
                    } catch (e) {}
                    if (videoId) {
                      return (
                        <YouTubeVideoPlayer
                          language={language}
                          videoId={videoId}
                          title={property?.title}
                          width="100%"
                          height={500}
                          className="rounded-lg shadow-lg"
                          autoplay={false}
                        />
                      );
                    }
                    // fallback
                    return (
                      <div className="w-full h-[500px] flex items-center justify-center bg-gray-800 rounded-lg shadow-lg">
                        <span className="text-gray-400">Video unavailable</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center bg-gray-800 rounded-lg shadow-lg">
                    <span className="text-gray-400">No image or video</span>
                  </div>
                )}

                <span
                  className={`absolute top-4 ${
                    language === "ar" ? "right-4" : "left-4"
                  } text-white font-semibold px-4 py-2 rounded-md text-base ${
                    isForSale ? "bg-green-600" : "bg-sky-600"
                  }`}
                >
                  {(property as any).status === "For Sale" ||
                  property.status === "للبيع"
                    ? language === "ar"
                      ? "للبيع"
                      : "For Sale"
                    : language === "ar"
                    ? "للإيجار"
                    : "For Rent"}
                  {/* تم التعديل هنا */}
                </span>
              </div>
              {(property.gallery && property.gallery.length > 0) ||
              (property.videos && property.videos.length > 0) ? (
                <div className="grid grid-cols-5 gap-2">
                  {/* Images */}
                  {property.gallery?.map((img, index) => (
                    <img
                      key={`img-${index}`}
                      src={img?.thumbnailUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-md cursor-pointer border-2 transition-all ${
                        mainImage === img?.previewUrl
                          ? "border-amber-500"
                          : "border-transparent hover:border-amber-400"
                      }`}
                      onClick={() => setMainImage(img?.previewUrl)}
                      loading="lazy"
                    />
                  ))}
                  {/* Videos */}
                  {property.videos?.map((video, vIdx) => {
                    return (
                      <div
                        key={`vid-${vIdx}`}
                        className={`relative w-full h-32 rounded-md cursor-pointer border-2 transition-all overflow-hidden ${
                          mainImage === video.video_url
                            ? "border-amber-500"
                            : "border-transparent hover:border-amber-400"
                        }`}
                        onClick={() => setMainImage(video.video_url)}
                        title={"YouTube Video"}
                      >
                        <img
                          src={
                            video?.thumbnail_url ||
                            "/images/video-placeholder.png"
                          }
                          alt={`Video Thumbnail ${vIdx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-white bg-black bg-opacity-50 rounded-full p-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Description */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4">
                {t.propertyDetailsPage?.description}
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description ||
                  (t.propertyDetailsPage as any)?.noDescription}
              </p>{" "}
              {/* تم التعديل هنا */}
            </div>

            {(property as any).amenities &&
              (property as any).amenities.length > 0 && (
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
                  <h2 className="text-2xl font-bold text-amber-500 mb-6">
                    {t.propertyDetailsPage?.amenities}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(property as any).amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Map */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-amber-500 mb-4">
                {t.propertyDetailsPage?.mapLocation}
              </h2>
              <div className="overflow-hidden rounded-lg">
                {property.latitude && property.longitude ? (
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55262.31741482358!2d${property.longitude}!3d${property.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzIwLjgiTiAzMcKwMzYnNDAuMCJF!5e0!3m2!1sen!2seg!4v1678886543210`}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27625.686876055146!2d31.60533565!3d30.122421899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581bb448a04499%3A0x3977a7c06ac29759!2sNew%20Heliopolis%2C%20El%20Shorouk%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1678886543210!5m2!1sen!2seg"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Price and Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-800 p-8 rounded-lg border border-gray-700">
              <p className="text-4xl font-bold text-amber-500 mb-6">
                {property.price}
              </p>{" "}
              <div className="flex justify-around items-center text-gray-300 border-y border-gray-700 py-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <BedIcon className="w-8 h-8 text-gray-400" />
                  <span className="font-bold">{property.bedrooms}</span>{" "}
                  <span>{t.propertyDetailsPage?.bedrooms}</span>
                </div>

                {isForSale &&
                  ((property as any).type === "apartment" ||
                    (property as any).type === "villa" ||
                    property.type === "شقة" ||
                    property.type === "فيلا") &&
                  property.finish && (
                    <div className="flex flex-col items-center gap-2">
                      <Settings className="w-8 h-8 text-gray-400" />

                      <span className="font-bold">{property.finish}</span>
                      <span>
                        {(t.propertyDetailsPage as any)?.finishing ||
                          (language === "ar" ? "التشطيب" : "Finishing")}
                      </span>
                    </div>
                  )}

                <div className="flex flex-col items-center gap-2">
                  <AreaIcon className="w-8 h-8 text-gray-400" />
                  <span className="font-bold">{property.area} m²</span>{" "}
                  {/* تم التعديل هنا */}
                  <span>{t.propertyDetailsPage?.area}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {t.propertyDetailsPage?.contactAgent}
              </h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-400">
                  {t.propertyDetailsPage?.contactText}
                </p>
              </div>
              <Link
                to="/contact"
                className="w-full block text-center bg-amber-500 text-gray-900 font-bold px-6 py-4 rounded-lg text-lg hover:bg-amber-600 transition-colors duration-200"
              >
                {t.propertyDetailsPage?.contactButton}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
