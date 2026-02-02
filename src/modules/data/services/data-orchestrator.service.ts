import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageFactory } from '../factories/storage.factory';
import { CreateDataDto } from '../dto/create-data.dto';
import { UpdateDataDto } from '../dto/update-data.dto';
import { QueryDataDto } from '../dto/query-data.dto';
import { StorageType } from '../repositories/interfaces/storage.interface';
import {
  DataChangeEvent,
  DataChangeType,
} from '../../notification/events/data-change.event';
import { LoggerService } from '../../logging/services/logger.service';

@Injectable()
export class DataOrchestratorService {
  constructor(
    private readonly storageFactory: StorageFactory,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {}

  async create(createDataDto: CreateDataDto) {
    const { key, value, storageType, metadata } = createDataDto;
    const repository = this.storageFactory.getRepository(storageType);

    this.logger.log(
      `Creating data with key: ${key} in ${storageType}`,
      'DataService',
    );

    const result = await repository.save(key, value, metadata);

    this.eventEmitter.emit(
      'data.changed',
      new DataChangeEvent(key, DataChangeType.CREATED, storageType, result),
    );

    return {
      id: (result as any).id || key,
      key,
      status: 'success',
      storageType,
    };
  }

  async findByKey(key: string, storageType?: StorageType) {
    if (storageType) {
      const repository = this.storageFactory.getRepository(storageType);
      const data = await repository.findByKey(key);

      if (!data) {
        throw new NotFoundException(`Key "${key}" not found in ${storageType}`);
      }

      return {
        key,
        value: (data as any).value || data,
        source: storageType,
        timestamp: (data as any).updatedAt || (data as any).createdAt,
      };
    }

    for (const type of [StorageType.DATABASE, StorageType.FILE]) {
      const repository = this.storageFactory.getRepository(type);
      const data = await repository.findByKey(key);

      if (data) {
        return {
          key,
          value: (data as any).value || data,
          source: type,
          timestamp: (data as any).updatedAt || (data as any).createdAt,
        };
      }
    }

    throw new NotFoundException(`Key "${key}" not found in any storage`);
  }

  async update(key: string, updateDataDto: UpdateDataDto) {
    const { value, storageType, metadata } = updateDataDto;
    const repository = this.storageFactory.getRepository(storageType);

    this.logger.log(
      `Updating data with key: ${key} in ${storageType}`,
      'DataService',
    );

    const result = await repository.update(key, value, metadata);

    this.eventEmitter.emit(
      'data.changed',
      new DataChangeEvent(key, DataChangeType.UPDATED, storageType, result),
    );

    return {
      key,
      status: 'updated',
      storageType,
    };
  }

  async delete(key: string, storageType?: StorageType) {
    if (storageType) {
      const repository = this.storageFactory.getRepository(storageType);
      const deleted = await repository.delete(key);

      if (!deleted) {
        throw new NotFoundException(`Key "${key}" not found in ${storageType}`);
      }

      this.eventEmitter.emit(
        'data.changed',
        new DataChangeEvent(key, DataChangeType.DELETED, storageType),
      );

      return { status: 'deleted', key, storageType };
    }

    let deleted = false;
    for (const type of [StorageType.DATABASE, StorageType.FILE]) {
      const repository = this.storageFactory.getRepository(type);
      const result = await repository.delete(key);
      if (result) {
        deleted = true;
        this.eventEmitter.emit(
          'data.changed',
          new DataChangeEvent(key, DataChangeType.DELETED, type),
        );
      }
    }

    if (!deleted) {
      throw new NotFoundException(`Key "${key}" not found in any storage`);
    }

    return { status: 'deleted', key };
  }

  async findAll(queryDataDto: QueryDataDto) {
    const { storageType, page = 1, limit = 10 } = queryDataDto;

    if (storageType === 'all') {
      const dbRepo = this.storageFactory.getRepository(StorageType.DATABASE);
      const fileRepo = this.storageFactory.getRepository(StorageType.FILE);

      const [dbResult, fileResult] = await Promise.all([
        dbRepo.findAll(page, limit),
        fileRepo.findAll(page, limit),
      ]);

      return {
        data: [...dbResult.data, ...fileResult.data],
        total: dbResult.total + fileResult.total,
        page,
        limit,
      };
    }

    const repository = this.storageFactory.getRepository(
      (storageType || StorageType.DATABASE) as StorageType,
    );
    const result = await repository.findAll(page, limit);

    return {
      ...result,
      page,
      limit,
    };
  }
}

