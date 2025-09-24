import React from 'react';
import { BuildingIcon, CheckCircleIcon, PriceIcon, LocationMarkerIcon } from './icons/Icons';
import type { Language } from '../App';
import { SiteContent } from "../types";

interface IntegrationsProps {
  language: Language;
  siteContent: SiteContent;
}

// هنشيل الـ title ونخلي description هو اللي يبان
const FeatureCard: React.FC<{ icon: React.ReactNode; description: string }> = ({ icon, description }) => (
  <div className="bg-gray-800 p-8 rounded-2xl border border-transparent hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1 h-full">
    <div className="flex-shrink-0 bg-amber-500/10 text-amber-500 p-4 rounded-full mb-6 inline-block">
      {icon}
    </div>
    <p className="text-gray-100 font-semibold text-lg">{description}</p>
  </div>
);

const Integrations: React.FC<IntegrationsProps> = ({ language, siteContent }) => {
  const { aboutTitle, aboutSubtitle, aboutPoints } = siteContent;

  // هنا هنخلي الـ aboutPoints يطلع في description بدل title
  const features = [
  {
    icon: <BuildingIcon className="w-8 h-8" />,
    description: aboutPoints?.[0]?.description || "جودة البناء",
  },
  {
    icon: <PriceIcon className="w-8 h-8" />,
    description: aboutPoints?.[1]?.description || "أسعار مناسبة",
  },
  {
    icon: <CheckCircleIcon className="w-8 h-8" />,
    description: aboutPoints?.[2]?.description || "ضمان الجودة",
  },
  {
    icon: <LocationMarkerIcon className="w-8 h-8" />,
    description: aboutPoints?.[3]?.description || "مواقع مميزة",
  }
];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {aboutTitle || "لماذا تختارنا"}
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
            {aboutSubtitle || "نحن نقدم أفضل الخدمات لعملائنا الكرام"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
