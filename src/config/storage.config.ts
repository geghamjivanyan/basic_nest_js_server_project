import { ConfigService } from '@nestjs/config';

export interface StorageConfig {
  path: string;
  maxSize: number;
}

export const getStorageConfig = (configService: ConfigService): StorageConfig => ({
  path: configService.get<string>('storage.path') ?? './storage',
  maxSize: configService.get<number>('storage.maxSize') ?? 10485760,
});

