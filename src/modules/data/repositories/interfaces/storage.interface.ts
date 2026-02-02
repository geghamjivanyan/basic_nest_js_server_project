export interface IStorageRepository {
  save(key: string, value: any, metadata?: any): Promise<any>;
  findByKey(key: string): Promise<any>;
  update(key: string, value: any, metadata?: any): Promise<any>;
  delete(key: string): Promise<boolean>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }>;
}

export enum StorageType {
  DATABASE = 'database',
  FILE = 'file',
}

