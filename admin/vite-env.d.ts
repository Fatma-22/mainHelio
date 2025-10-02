/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  // يمكنك إضافة المزيد من متغيرات البيئة هنا
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}