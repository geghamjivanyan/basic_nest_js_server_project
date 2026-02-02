import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataEntry } from '../entities/data-entry.entity';
import { IStorageRepository } from './interfaces/storage.interface';

@Injectable()
export class DatabaseRepository implements IStorageRepository {
  constructor(
    @InjectRepository(DataEntry)
    private readonly dataRepository: Repository<DataEntry>,
  ) {}

  async save(key: string, value: any, metadata?: any): Promise<DataEntry> {
    const entry = this.dataRepository.create({ key, value, metadata });
    return await this.dataRepository.save(entry);
  }

  async findByKey(key: string): Promise<DataEntry | null> {
    return await this.dataRepository.findOne({ where: { key } });
  }

  async update(key: string, value: any, metadata?: any): Promise<DataEntry> {
    await this.dataRepository.update({ key }, { value, metadata });
    return (await this.findByKey(key)) as DataEntry;
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.dataRepository.delete({ key });
    return (result.affected ?? 0) > 0;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: DataEntry[]; total: number }> {
    const [data, total] = await this.dataRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }
}

