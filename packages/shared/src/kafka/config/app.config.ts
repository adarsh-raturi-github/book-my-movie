interface AppConfig {
  serviceName: string;
}

let config: AppConfig;

export function initializeAppConfig(cfg: AppConfig) {
  config = cfg;
}

export function getAppConfig() {
  if (!config) {
    throw new Error("App config not initialized.");
  }

  return config;
}
