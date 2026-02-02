import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

export const Cached = () =>
  applyDecorators(
    UseInterceptors(CacheInterceptor),
  );

