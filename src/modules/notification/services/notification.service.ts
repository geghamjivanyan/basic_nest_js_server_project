import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataChangeEvent } from '../events/data-change.event';
import { LoggerService } from '../../logging/services/logger.service';

@Injectable()
export class NotificationService {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('data.changed')
  handleDataChange(event: DataChangeEvent) {
    this.logger.log(
      `Data ${event.changeType}: key="${event.key}", storage="${event.storageType}"`,
      'NotificationService',
    );

    // Send console notification
    // eslint-disable-next-line no-console
    console.log('📢 NOTIFICATION:', {
      type: event.changeType,
      key: event.key,
      storage: event.storageType,
      timestamp: new Date().toISOString(),
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Mock email service
    this.logger.log(`Email sent to ${to}: ${subject}`, 'NotificationService');
  }
}

