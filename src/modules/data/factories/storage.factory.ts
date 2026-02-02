import { Injectable } from '@nestjs/common';
import {
  IStorageRepository,
  StorageType,
} from '../repositories/interfaces/storage.interface';
import { DatabaseRepository } from '../repositories/database.repository';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class StorageFactory {
  constructor(
    private readonly databaseRepository: DatabaseRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  getRepository(storageType: StorageType): IStorageRepository {
    switch (storageType) {
      case StorageType.DATABASE:
        return this.databaseRepository;
      case StorageType.FILE:
        return this.fileRepository;
      default:
        throw new Error(`Unknown storage type: ${storageType}`);
    }
  }
}

