import React, { useState, useEffect } from "react";
import DecorationRequestModal from "./DecorationRequestModal";
import type { Language } from "../App";
import { translations } from "../data/translations";
import { getPortfolioItems } from "../services/portfolioService";
import type { PortfolioItem } from "../types";
type ModalInfoProps = {
  isOpen: Boolean;
  title: string;

  serviceType: string;
  requestType: "custom" | "similar";
  item: PortfolioItem;
};
const DecorationsPage: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language].decorationsPage;
  const [activeTab, setActiveTab] = useState<"wall" | "painting" | "antique">(
    "wall"
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalInfo, setModalInfo] = useState<ModalInfoProps>({
    isOpen: false,
    title: undefined,
    serviceType: undefined,
    item: undefined,
    requestType: "custom",
  });

  // 🟢 تحميل البيانات من البورتفوليو مع إضافة حالة التحميل والخطأ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const items = await getPortfolioItems();
        setPortfolioItems(items);
        setError(null);
      } catch (error) {
        console.error("فشل في جلب عناصر البورتفوليو:", error);
        setError(
          language === "ar"
            ? "فشل في تحميل البيانات. يرجى المحاولة مرة أخرى لاحقًا."
            : "Failed to load data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  const openModal = ({
    serviceType,
    item,
  }: Pick<ModalInfoProps, "serviceType" | "item">) => {
    const requestType = !!item?.id ? "similar" : "custom";

    let title = "";
    if (requestType === "similar") {
      title = t.modalTitleSimilar;
    } else if (serviceType === "wall-decor") {
      title = t.modalTitleCustomWallDecor;
    } else if (serviceType === "painting") {
      title = t.modalTitleCustomPainting;
    } else {
      title = t.modalTitleCustomAntique;
    }

    setModalInfo({
      isOpen: true,
      title,
      serviceType,
      requestType,
      item,
    });
  };

  const closeModal = () => {
    setModalInfo({
      isOpen: false,
      title: undefined,
      serviceType: undefined,
      item: undefined,
      requestType: "custom",
    });
  };

  // دالة لفتح الصورة
  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
  };

  // دالة لإغلاق الصورة
  const closeLightbox = () => setLightboxImage(null);

  // 🟢 ربط التاب بالـ type من البورتفوليو
  const tabs = [
    {
      key: "wall",
      name: t.tab1,
      desc: t.tab1Desc,
      serviceType: "wall-decor",
      type: "منحوتات جدارية",
    },
    {
      key: "painting",
      name: t.tab2,
      desc: t.tab2Desc,
      serviceType: "painting",
      type: "لوحات كانفس",
    },
    {
      key: "antique",
      name: t.tab3,
      desc: t.tab3Desc,
      serviceType: "antique",
      type: "تحف ديكورية",
    },
  ];

  const activeTabData = tabs.find((tab) => tab.key === activeTab);

  // 🔹 تعديل: فلترة العناصر بناءً على النوع مع مراعاة التوافق مع الباك إند
  const filteredItems = portfolioItems.filter(
    (item) => item.type === activeTabData?.type
  );

  return (
    <div className="bg-gray-900 text-white">
      {/* Modal */}
      {modalInfo?.isOpen && (
        <DecorationRequestModal
          onClose={closeModal}
          serviceTitle={modalInfo.title}
          serviceType={modalInfo.serviceType}
          requestType={modalInfo.requestType}
          item={modalInfo?.item}
          language={language}
        />
      )}

      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
        <div className="relative z-20 px-4 container mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold">{t.heroTitle}</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mt-4">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="border-b border-gray-700 mb-12">
            <nav className=" flex justify-center gap-4 lg:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "border-amber-500 text-amber-500"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTabData && (
            <div key={activeTab} className="animate-fadeIn">
              <div className="text-center mb-12">
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  {activeTabData.desc}
                </p>
              </div>

              {/* عرض رسالة التحميل */}
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              )}

              {/* عرض رسالة الخطأ */}
              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 mb-12 text-center">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {language === "ar" ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              )}

              {/* Portfolio Grid */}
              {!loading && !error && (
                <>
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg">
                        {language === "ar"
                          ? "لا توجد عناصر لعرضها في هذا الفئة حاليًا."
                          : "No items to display in this category at the moment."}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-800 w-[calc(50%-1.5rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)] aspect-w-1 aspect-h-1"
                        >
                          {/* 🔹 تعديل: استخدام cover_url بدلاً من imageUrl مع إضافة صورة بديلة */}
                          <img
                            src={
                              item?.cover_url ||
                              item.imageUrl ||
                              "/placeholder-image.jpg"
                            }
                            alt={
                              item.title ||
                              (language === "ar"
                                ? "صورة بورتفوليو"
                                : "Portfolio Image")
                            }
                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                            onClick={() =>
                              openLightbox(
                                item?.cover_url ||
                                  item.imageUrl ||
                                  "/placeholder-image.jpg"
                              )
                            }
                            loading="lazy"
                          />

                          {/* Overlay للزرار فقط */}
                          <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // يمنع الضغط يوصل للصورة
                                openModal({
                                  serviceType: activeTabData.serviceType,
                                  item,
                                });
                              }}
                              className="bg-amber-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors pointer-events-auto"
                            >
                              {t.requestSimilarButton}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Custom Request Button */}
              <div className="text-center">
                <button
                  onClick={() =>
                    openModal({
                      serviceType: activeTabData.serviceType,
                      item: undefined,
                    })
                  }
                  className="bg-gray-800 border border-amber-500 text-amber-500 font-semibold px-8 py-3 rounded-lg text-lg hover:bg-amber-500 hover:text-gray-900 transition-colors duration-200 shadow-lg shadow-amber-500/10"
                >
                  {t.requestCustomButton}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeLightbox}
        >
          <img
            src={lightboxImage}
            alt="Zoomed"
            className="w-[90vw] h-[90vh] object-contain rounded-lg shadow-xl"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default DecorationsPage;
