// src/services/decorationRequestsService.ts
import api from "./api";
import type { DecorationRequest } from "../types";
import { mapApiDecorationRequestToDecorationRequest } from "./mappers";

export const createDecorRequest = async (data: {
  clientName: string;
  clientPhone: string;
  type: string;
  details: string;
  reference_item_id?: number | null;
  image?: File;
  altText?: string;
  caption?: string;
}): Promise<DecorationRequest> => {
  const formData = new FormData();

  // إضافة البيانات النصية
  formData.append("clientName", data.clientName || "");
  formData.append("clientPhone", data.clientPhone || "");
  formData.append("type", data.type || "");
  formData.append("details", data.details || "");

  if (data.reference_item_id) {
    formData.append("reference_item_id", data.reference_item_id.toString());
  }

  if (data.altText) {
    formData.append("altText", data.altText);
  }

  if (data.caption) {
    formData.append("caption", data.caption);
  }

  // إضافة الصورة إذا كانت موجودة
  if (data.image) {
    formData.append("image", data.image);
  }
  const response = await api.post("/decor-requests", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return mapApiDecorationRequestToDecorationRequest(
    response.data.data || response.data
  );
};
