import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './controllers/data.controller';
import { DataOrchestratorService } from './services/data-orchestrator.service';
import { DatabaseRepository } from './repositories/database.repository';
import { FileRepository } from './repositories/file.repository';
import { StorageFactory } from './factories/storage.factory';
import { DataEntry } from './entities/data-entry.entity';
import { NotificationModule } from '../notification/notification.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataEntry]),
    NotificationModule,
    LoggingModule,
  ],
  controllers: [DataController],
  providers: [
    DataOrchestratorService,
    DatabaseRepository,
    FileRepository,
    StorageFactory,
  ],
})
export class DataModule {}

