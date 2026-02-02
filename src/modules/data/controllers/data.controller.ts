import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { DataOrchestratorService } from '../services/data-orchestrator.service';
import { CreateDataDto } from '../dto/create-data.dto';
import { UpdateDataDto } from '../dto/update-data.dto';
import { QueryDataDto } from '../dto/query-data.dto';
import { ApiKeyGuard } from '../../../common/guards/api-key.guard';
import { LoggingInterceptor } from '../../logging/interceptors/logging.interceptor';
import { StorageType } from '../repositories/interfaces/storage.interface';

@ApiTags('data')
@ApiSecurity('api-key')
@Controller('api/data')
@UseGuards(ApiKeyGuard)
@UseInterceptors(LoggingInterceptor)
export class DataController {
  constructor(private readonly dataService: DataOrchestratorService) {}

  @Post()
  @ApiOperation({ summary: 'Create new data entry' })
  @ApiResponse({ status: 201, description: 'Data created successfully' })
  create(@Body() createDataDto: CreateDataDto) {
    return this.dataService.create(createDataDto);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get data by key' })
  @ApiResponse({ status: 200, description: 'Data found' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  findOne(
    @Param('key') key: string,
    @Query('storageType') storageType?: StorageType,
  ) {
    return this.dataService.findByKey(key, storageType);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update data by key' })
  @ApiResponse({ status: 200, description: 'Data updated successfully' })
  update(@Param('key') key: string, @Body() updateDataDto: UpdateDataDto) {
    return this.dataService.update(key, updateDataDto);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete data by key' })
  @ApiResponse({ status: 200, description: 'Data deleted successfully' })
  delete(
    @Param('key') key: string,
    @Query('storageType') storageType?: StorageType,
  ) {
    return this.dataService.delete(key, storageType);
  }

  @Get()
  @ApiOperation({ summary: 'List all data entries' })
  @ApiResponse({ status: 200, description: 'Data list retrieved' })
  findAll(@Query() queryDataDto: QueryDataDto) {
    return this.dataService.findAll(queryDataDto);
  }
}

