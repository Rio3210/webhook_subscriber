import { createHmac, timingSafeEqual } from 'node:crypto';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SecretTokenGuard implements CanActivate {
  constructor(
    private readonly headerFieldName: string,
    private readonly secretName: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();

    const signature = request.headers[this.headerFieldName];

    if (!signature) {
      throw new UnauthorizedException(
        `Missing header: ${this.headerFieldName}`,
      );
    }

    const secret = 'vGJKxrlz2fsJsleP4RHFpar1StCJ0yTm4he3Xb3u';

    if (!secret) {
      throw new UnauthorizedException(`Missing secret: ${this.secretName}`);
    }

    this.verifySignature(signature as string, request.body, secret);

    return true;
  }

  private verifySignature(
    signature: string,
    payload: any,
    secret: string,
  ): void {
    const hmac = createHmac('sha1', secret);
    hmac.update(payload);
    const expectedSignature = `sha1=${hmac.digest('hex')}`;

    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureBuffer = Buffer.from(signature);

    if (!timingSafeEqual(expectedBuffer, signatureBuffer)) {
      throw new UnauthorizedException('Invalid HMAC signature.');
    }
  }
}
