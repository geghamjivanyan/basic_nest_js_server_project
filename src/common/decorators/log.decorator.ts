import { SetMetadata } from '@nestjs/common';

export const LOG_CONTEXT_KEY = 'logContext';

export const LogContext = (context: string) => SetMetadata(LOG_CONTEXT_KEY, context);

