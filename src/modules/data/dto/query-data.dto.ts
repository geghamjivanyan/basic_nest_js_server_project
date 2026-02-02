import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StorageType } from '../repositories/interfaces/storage.interface';

export class QueryDataDto {
  @ApiProperty({
    enum: [...Object.values(StorageType), 'all'],
    required: false,
    default: 'all',
  })
  @IsOptional()
  @IsEnum([...Object.values(StorageType), 'all'] as const)
  storageType?: StorageType | 'all' = 'all';

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

