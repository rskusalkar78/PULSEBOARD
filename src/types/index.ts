export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface AppConfig {
  title: string;
  env: Environment;
  apiBaseUrl: string;
}
