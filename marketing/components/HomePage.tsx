import React from "react";
import Hero from "./Hero";
import SocialProof from "./SocialProof";
import Services from "./Services";
import AboutCity from "./AboutCity";
import Partners from "./Partners";
import Integrations from "./Integrations";
import CTA from "./CTA";
import WisdomQuotes from "./Testimonial";
import type { Language } from "../App";
import { SiteContent, Property } from "../types";

interface HomePageProps {
  language: Language;
  siteContentAr: SiteContent | null;
  siteContentEn: SiteContent | null;
  featuredProperties: Property[];
  isLoading?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  language,
  siteContentAr,
  siteContentEn,
  featuredProperties,
  isLoading = false,
}) => {
  const currentSiteContent = language === "en" ? siteContentEn : siteContentAr;

  if (!currentSiteContent) return <div>Loading...</div>;

  return (
    <>
      <Hero
        language={language}
        siteContent={currentSiteContent}
        featuredProperties={featuredProperties}
      />
      <Services language={language} siteContent={currentSiteContent} />
      <AboutCity language={language} siteContent={currentSiteContent} />
      <Integrations language={language} siteContent={currentSiteContent} />
      <SocialProof
        language={language}
        featuredProperties={featuredProperties}
        isLoading={isLoading}
      />
      {/* <Partners language={language} />
      <WisdomQuotes language={language} /> */}
      <CTA language={language} />
    </>
  );
};

export default HomePage;
