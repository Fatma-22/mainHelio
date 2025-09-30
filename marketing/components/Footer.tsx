import React from "react";
import { Link } from "react-router-dom";
import {
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "./icons/Icons";
import type { Language } from "../App";
import { SiteContent } from "../types";
import { translations } from "../data/translations";

interface FooterProps {
  language: Language;
  siteContentAr?: SiteContent;
  siteContentEn?: SiteContent;
}

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <li>
    <Link
      to={to}
      className="text-gray-400 hover:text-amber-500 transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white bg-gray-700 hover:bg-amber-500 p-2 rounded-full transition-colors duration-200"
  >
    {children}
  </a>
);

const Footer: React.FC<FooterProps> = ({
  language,
  siteContentAr,
  siteContentEn,
}) => {
  const t = translations[language];

  // اختيار المحتوى بناءً على اللغة
  const siteContent = language === "ar" ? siteContentAr : siteContentEn;

  // استخدام القيم الافتراضية إذا كان siteContent غير معرّف
  const contactPhone = siteContent?.contactPhone || "+20 123 456 7890";
  const contactEmail = siteContent?.contactEmail || "info@onlyhelio.com";
  const contactAddress = siteContent?.contactAddress || t.footer.address;
  const contactTitle = siteContent?.contactTitle || "ONLY HELIO";
  const contactSubtitle = siteContent?.contactSubtitle || t.footer.description;
  const workingHours = siteContent?.workingHours;
  const socialLinks = siteContent?.socialLinks || {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "",
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-3xl font-bold text-amber-500 mb-4 block"
            >
              {contactTitle}
            </Link>
            <p className="text-gray-400 max-w-md">{contactSubtitle}</p>
            <div className={`flex gap-4 mt-6`}>
              <SocialLink href={socialLinks.facebook}>
                <FacebookIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={socialLinks.twitter}>
                <TwitterIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={socialLinks.instagram}>
                <InstagramIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={socialLinks.linkedin}>
                <LinkedInIcon className="h-5 w-5" />
              </SocialLink>
              {socialLinks.youtube && (
                <SocialLink href={socialLinks.youtube}>
                  <span className="h-5 w-5">🎬</span>
                </SocialLink>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <FooterLink to="/">{t.nav.home}</FooterLink>
              <FooterLink to="/properties">{t.nav.properties}</FooterLink>
              <FooterLink to="/finishing">{t.nav.finishing}</FooterLink>
              <FooterLink to="/decoration">{t.nav.decorations}</FooterLink>
              <FooterLink to="/contact">{t.nav.contact}</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.contactUs}</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span>📍</span>
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <span>📞</span>
                <span dir="ltr">{contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span>✉️</span>
                <span>{contactEmail}</span>
              </li>
              {workingHours && (
                <li className="flex items-center gap-3">
                  <span>🕒</span>
                  <span>{workingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ONLY HELIO.{" "}
            {t.footer.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
