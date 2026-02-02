import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StorageType } from '../repositories/interfaces/storage.interface';

export class UpdateDataDto {
  @ApiProperty({ example: { name: 'John Updated', age: 31 } })
  @IsNotEmpty()
  value: any;

  @ApiProperty({ enum: StorageType, example: StorageType.DATABASE })
  @IsEnum(StorageType)
  storageType: StorageType;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}

