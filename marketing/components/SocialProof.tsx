import React from 'react';
import { Link } from 'react-router-dom';
import FeatureSection from './FeatureSection';
import PropertyCardSkeleton from './shared/PropertyCardSkeleton';
import type { Property } from '../types';
import type { Language } from '../App';
import { translations } from '../data/translations';

interface SocialProofProps {
  language: Language;
  featuredProperties: Property[];
  isLoading?: boolean;
}

const SocialProof: React.FC<SocialProofProps> = ({
  language,
  featuredProperties,
  isLoading = false,
}) => {
  const t = translations[language];

  const noProperties =
    !isLoading &&
    (!featuredProperties || featuredProperties.length === 0);

  return (
    <div className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t.latestProperties}
          </h2>
          <Link
            to="/properties"
            className="text-amber-500 font-semibold hover:underline"
          >
            {t.viewAll}
          </Link>
        </div>

        {isLoading ? (
          // أثناء التحميل
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : noProperties ? (
          // لو مفيش أي عقارات
          <div className="text-center text-gray-400 py-10 text-lg">
            {language === 'ar'
              ? 'لا توجد عقارات حالياً'
              : 'No properties available at the moment'}
          </div>
        ) : (
          // لو فيه عقارات فعلية
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProperties.map((prop) => (
              <FeatureSection key={prop.id} {...prop} language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialProof;
