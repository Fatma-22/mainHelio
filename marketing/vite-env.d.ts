/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_API_KEY: string;
  // زوّدي أي env variables تانية عندك بنفس الشكل
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
