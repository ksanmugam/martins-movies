/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_MODE: boolean;
  readonly VITE_TMDB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}