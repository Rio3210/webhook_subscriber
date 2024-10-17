import { Injectable, Type } from '@nestjs/common';
import { SecretTokenGuard } from './secret-token.guard';

export function secretTokenGuard(
  headerFieldName: string,
  secretName: string,
): Type<SecretTokenGuard> {
  @Injectable()
  class DynamicSecretTokenGuard extends SecretTokenGuard {
    constructor() {
      super(headerFieldName, secretName);
    }
  }
  return DynamicSecretTokenGuard;
}
