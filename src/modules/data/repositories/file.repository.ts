import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageRepository } from './interfaces/storage.interface';

@Injectable()
export class FileRepository implements IStorageRepository {
  private readonly storagePath: string;

  constructor(private configService: ConfigService) {
    this.storagePath = this.configService.get<string>('storage.path') as string;
    this.ensureStorageDirectory();
  }

  private async ensureStorageDirectory() {
    try {
      await fs.access(this.storagePath);
    } catch {
      await fs.mkdir(this.storagePath, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    return path.join(this.storagePath, `${key}.json`);
  }

  async save(key: string, value: any, metadata?: any): Promise<any> {
    const data = {
      key,
      value,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const filePath = this.getFilePath(key);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }

  async findByKey(key: string): Promise<any> {
    try {
      const filePath = this.getFilePath(key);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async update(key: string, value: any, metadata?: any): Promise<any> {
    const existing = await this.findByKey(key);
    if (!existing) {
      throw new NotFoundException(`Key "${key}" not found in file storage`);
    }

    const data = {
      ...existing,
      value,
      metadata: metadata || existing.metadata,
      updatedAt: new Date().toISOString(),
    };

    const filePath = this.getFilePath(key);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);
      await fs.unlink(filePath);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; total: number }> {
    const files = await fs.readdir(this.storagePath);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    const allData = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(this.storagePath, file),
          'utf-8',
        );
        return JSON.parse(content);
      }),
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = allData.slice(start, end);

    return { data: paginatedData, total: allData.length };
  }
}

