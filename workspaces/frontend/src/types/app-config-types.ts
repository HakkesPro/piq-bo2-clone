interface BaseEnvironment {
  legacyBackofficeUrl: string
  boApiEndpoint: string,
  piqApiEndpoint: string,
}

interface Proxy {
  target: string;
  changeOrigin?: boolean;
  headers?: {
    Connection?: string;
    secure?: boolean;
    Host?: string;
  };
}

interface Dev extends BaseEnvironment {
  proxy: Proxy;
}

interface DevHosted extends BaseEnvironment {
  proxy: Proxy;
}

export enum EnvironmentTypes {
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
  DEV = 'DEV',
  DEV_HOSTED = 'DEV_HOSTED',
}

export interface AppConfig {
  [EnvironmentTypes.PRODUCTION]: BaseEnvironment;
  [EnvironmentTypes.TEST]: BaseEnvironment;
  [EnvironmentTypes.DEV]: Dev;
  [EnvironmentTypes.DEV_HOSTED]: DevHosted;
}
