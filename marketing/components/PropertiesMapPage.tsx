import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Map as LeafletMap, Icon as LeafletIcon } from 'leaflet';
import L from 'leaflet';
import type { Language } from '../App';
import { translations } from '../data/translations';
import { getProperties } from '../services/propertyService';
import type { Property } from '../types';
import { BedIcon, BathIcon, AreaIcon } from './icons/Icons';

interface PropertiesMapPageProps {
  language: Language;
}

// ✅ تأكيد نوع الأيقونة
const amberIcon: LeafletIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ✅ إحداثيات افتراضية
const defaultPosition: [number, number] = [30.13831814569454, 31.679246011295543];

const PropertiesMapPage: React.FC<PropertiesMapPageProps> = ({ language }) => {
  const t = translations[language];
  const map_t = t.propertiesMapPage;
  const card_t = t.propertyCard;
  const [properties, setProperties] = useState<Property[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultPosition);

  useEffect(() => {
    const fetchProperties = async () => {
      const props = await getProperties();
      setProperties(props);

      const firstWithCoords = props.find(p => p.latitude && p.longitude);
      if (firstWithCoords) {
        setMapCenter([firstWithCoords.latitude!, firstWithCoords.longitude!]);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{map_t.title}</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{map_t.subtitle}</p>
        </div>
      </div>

      <div className="h-[75vh] w-full">
        {/* ✅ تم إضافة تأكيد نوع center */}
        <MapContainer
          center={mapCenter as [number, number]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* ✅ تعديل TileLayer attribution */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {properties.map((prop) => {
            const lat = prop.latitude || defaultPosition[0];
            const lng = prop.longitude || defaultPosition[1];

            return (
              // ✅ تأكيد نوع position و icon
              <Marker
                key={prop.id}
                position={[lat, lng] as [number, number]}
                icon={amberIcon}
              >
                <Popup>
                  <div className="w-full">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="text-md font-bold text-amber-500 mb-1 truncate">
                        {prop.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-200 mb-3">{prop.price}</p>
                      <div className="flex justify-between items-center text-gray-400 text-xs border-t border-gray-600 pt-3">
                        <div className="flex items-center gap-1">
                          <BedIcon className="w-4 h-4 text-gray-500" />
                          <span>
                            {prop.bedrooms} {card_t?.beds || (language === 'ar' ? 'غرف' : 'Beds')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BathIcon className="w-4 h-4 text-gray-500" />
                          <span>
                            {prop.bathrooms}{' '}
                            {card_t?.baths || (language === 'ar' ? 'حمامات' : 'Baths')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AreaIcon className="w-4 h-4 text-gray-500" />
                          <span>
                            {prop.area} {card_t?.area || (language === 'ar' ? 'م²' : 'm²')}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/properties/${prop.id}`}
                        className="mt-4 block w-full text-center bg-amber-500 text-gray-900 font-semibold px-3 py-2 rounded-md text-sm hover:bg-amber-600 transition-colors"
                      >
                        {map_t.viewDetails}
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default PropertiesMapPage;
