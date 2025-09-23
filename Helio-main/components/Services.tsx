import React from 'react';
import { Link } from 'react-router-dom';
import { SiteContent } from "../types";

interface ServicesProps {
    siteContent: SiteContent;
}

const ServiceCard: React.FC<{ title: string; description: string; iconUrl: string; link: string; }> = ({ title, description, iconUrl, link }) => (
    <Link to={link} className="block group h-full">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transform hover:-translate-y-2 transition-transform duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col items-start">
            {iconUrl && (
                <img src={iconUrl} alt={title} className="w-10 h-10 mb-6 inline-block" />
            )}
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed flex-grow">{description}</p>
        </div>
    </Link>
);

const Services: React.FC<ServicesProps> = ({ siteContent }) => {
    return (
        <section className="py-20 bg-gray-800">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        {siteContent.servicesTitle}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(siteContent.services || []).map((service) => (
                        <ServiceCard
                            key={service.id}
                            title={service.title}
                            description={service.description}
                            iconUrl={service.iconUrl}
                            link={service.link}
                            
                        />
                    ))}
                </div>
            </div>
        </section>
        
    );
    
};

export default Services;
