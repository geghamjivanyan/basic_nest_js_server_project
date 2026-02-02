import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StorageType } from '../repositories/interfaces/storage.interface';

export class CreateDataDto {
  @ApiProperty({ example: 'user-123', description: 'Unique key for the data' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: { name: 'John', age: 30 },
    description: 'Data value (any JSON)',
  })
  @IsNotEmpty()
  value: any;

  @ApiProperty({ enum: StorageType, example: StorageType.DATABASE })
  @IsEnum(StorageType)
  storageType: StorageType;

  @ApiProperty({ required: false, description: 'Optional metadata' })
  @IsOptional()
  metadata?: any;
}

