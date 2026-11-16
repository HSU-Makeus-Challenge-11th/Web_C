/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_BASE_URL?: string;
  readonly VITE_TMDB_ACCESS_TOKEN?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
