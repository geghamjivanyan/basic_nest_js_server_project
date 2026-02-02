import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

