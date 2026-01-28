/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FEISHU_APP_ID: string;
  readonly VITE_FEISHU_APP_SECRET: string;
  readonly VITE_FEISHU_ACCOUNTS_URL: string;
  readonly VITE_FEISHU_API_URL: string;
  readonly VITE_FEISHU_AUTH_SCOPE: string;
  readonly VITE_FEISHU_BITABLE_APP_TOKEN: string;
  readonly VITE_FEISHU_BITABLE_TABLES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
