// src/pages/FinishingPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FinishingRequestModal from './FinishingRequestModal';
import { EyeIcon, CubeIcon, WrenchScrewdriverIcon } from './icons/Icons';
import type { Language } from '../App';
import { translations } from '../data/translations';
import { getPortfolioItems } from '../services/portfolioService';
import type { PortfolioItem } from '../types';

interface FinishingPageProps {
  language: Language;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onRequest: () => void;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, onRequest, buttonText }) => (
  <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center flex flex-col items-center h-full">
    <div className="flex-shrink-0 bg-amber-500/10 text-amber-500 p-4 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed flex-grow">{description}</p>
    <button
      onClick={onRequest}
      className="mt-6 bg-amber-500 text-gray-900 font-semibold px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
    >
      {buttonText}
    </button>
  </div>
);

const FinishingPage: React.FC<FinishingPageProps> = ({ language }) => {
  const t = translations[language].finishingPage;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (title: string) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openLightbox = (imageUrl: string, index: number) => {
    setLightboxImage(imageUrl);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage('');
  };

  // Navigate to next image
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % portfolioItems.length;
    setLightboxImage(portfolioItems[newIndex].imageUrl);
    setCurrentImageIndex(newIndex);
  };

  // Navigate to previous image
  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + portfolioItems.length) % portfolioItems.length;
    setLightboxImage(portfolioItems[newIndex].imageUrl);
    setCurrentImageIndex(newIndex);
  };

  // fetch portfolio items (gallery images)
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const items = await getPortfolioItems();
        // Filter items to only include those with type "تشطيبات"
        const filteredItems = items.filter(item => item.type === "تشطيبات");
        setPortfolioItems(filteredItems);
      } catch (err) {
        console.error("Error fetching portfolio items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // static services (unchanged design)
  const services = [
    {
      icon: <EyeIcon className="w-8 h-8" />,
      title: t.service1Title,
      description: t.service1Desc,
      onRequest: () => openModal(t.service1Title),
    },
    {
      icon: <CubeIcon className="w-8 h-8" />,
      title: t.service2Title,
      description: t.service2Desc,
      onRequest: () => openModal(t.service2Title),
    },
    {
      icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
      title: t.service3Title,
      description: t.service3Desc,
      onRequest: () => openModal(t.service3Title),
    }
  ];

  return (
    <div className="bg-gray-900 text-white">
      {isModalOpen && (
        <FinishingRequestModal 
          onClose={closeModal} 
          serviceTitle={modalTitle} 
          language={language} 
        />
      )}

      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop')",
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

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">{t.servicesTitle}</h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
              {t.servicesSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                {...service}
                buttonText={t.requestButton}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.galleryTitle}</h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
              {t.gallerySubtitle}
            </p>
          </div>
          {loading ? (
            <p className="text-center text-gray-400">{'Loading...'}</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
            {portfolioItems.map((item, index) => (
              <div key={item.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Portfolio item'}
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                  onClick={() => openLightbox(item.imageUrl, index)}
                  loading="lazy" 
                />
              </div>
            ))}
          </div>

          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto"
          onClick={closeLightbox}
        >
          {/* Navigation Arrows */}
          {portfolioItems.length > 1 && (
            <>
              {/* زر السهم اليمين */}
              <button
                className="absolute right-5 text-white text-4xl font-bold z-50 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage(); // دايمًا اليمين = التالي
                }}
              >
                {language === 'ar' ? '‹' : '›'}
              </button>

              {/* زر السهم الشمال */}
              <button
                className="absolute left-5 text-white text-4xl font-bold z-50 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage(); // دايمًا الشمال = السابق
                }}
              >
                {language === 'ar' ? '›' : '‹'}
              </button>
            </>
          )}

          
          <img
            src={lightboxImage}
            alt="Lightbox"
            className="w-[90vw] h-[90vh] rounded-lg shadow-xl object-contain"
            loading="lazy" 
          />
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            {t.ctaTitle}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-8">
            {t.ctaSubtitle}
          </p>
          <Link
            to="/contact"
            className="bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-lg text-lg hover:bg-amber-600 transition-colors duration-200 shadow-lg shadow-amber-500/20"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FinishingPage;