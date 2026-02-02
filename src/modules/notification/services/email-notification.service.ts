import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logging/services/logger.service';

@Injectable()
export class EmailNotificationService {
  private readonly defaultRecipient: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.defaultRecipient =
      this.configService.get<string>('NOTIFICATION_EMAIL') ??
      'notify@example.com';
  }

  async sendChangeNotification(subject: string, body: string): Promise<void> {
    // Mock email sending
    this.logger.log(
      `Email notification sent to ${this.defaultRecipient}: ${subject}`,
      'EmailNotificationService',
    );
  }
}

