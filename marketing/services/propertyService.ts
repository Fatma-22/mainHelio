import api from "./api";
import type { Property } from "../types";
import { mapApiPropertyToProperty } from "./mappers";

export const getProperties = async (): Promise<Property[]> => {
  const response = await api.get("/properties");
  const properties = response.data.data || response.data;
  return properties.map(mapApiPropertyToProperty);
};

export const getProperty = async (id: string): Promise<Property> => {
  const response = await api.get(`/properties/${id}`);
  return mapApiPropertyToProperty(response.data);
};
export const getFeaturedProperties = async (): Promise<Property[]> => {
  const response = await api.get("/properties");
  const properties = response.data.data || response.data;

  const mapped = properties.map(mapApiPropertyToProperty);

  // رجع آخر 4
  return mapped.slice(-4).reverse(); // reverse عشان الأحدث يبقى الأول
};
export const createProperty = async (propertyData: any): Promise<Property> => {
  const formData = new FormData();

  // إضافة البيانات النصية
  Object.keys(propertyData).forEach((key) => {
    if (key !== "images" && key !== "imagesData") {
      formData.append(key, propertyData[key]);
    }
  });

  // إضافة الصور
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });
  }

  // إضافة بيانات الصور كعناصر منفصلة
  if (propertyData.imagesData && propertyData.imagesData.length > 0) {
    propertyData.imagesData.forEach((imageData: any, index: number) => {
      Object.keys(imageData).forEach((key) => {
        const value = imageData[key];
        // Ensure booleans are sent in a way the backend boolean validator accepts
        if (key === "isFeatured") {
          const normalized = value ? "1" : "0";
          formData.append(`imagesData[${index}][${key}]`, normalized);
          return;
        }
        formData.append(`imagesData[${index}][${key}]`, value);
      });
    });
  }

  const response = await api.post("/properties/requests", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return mapApiPropertyToProperty(response.data);
};
