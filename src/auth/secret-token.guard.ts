import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

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

    const secret = 'surakute';

    if (!secret) {
      throw new UnauthorizedException(`Missing secret: ${this.secretName}`);
    }

    // Check if body exists, otherwise compare signature directly
    const payload = request.body || '';

    this.verifySignature(signature as string, payload, secret);

    return true;
  }

  private verifySignature(
    signature: string,
    payload: any,
    secret: string,
  ): void {
    // Compute HMAC of the payload
    const hmac = createHmac('sha1', secret);
    hmac.update(
      typeof payload === 'string' ? payload : JSON.stringify(payload),
    );
    const expectedSignature = `sha1=${hmac.digest('hex')}`;

    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureBuffer = Buffer.from(signature);

    // Check if the lengths match first (safe comparison)
    if (expectedBuffer.length !== signatureBuffer.length) {
      throw new UnauthorizedException(
        'Invalid HMAC signature (length mismatch).',
      );
    }

    // Perform timing safe comparison
    if (!timingSafeEqual(expectedBuffer, signatureBuffer)) {
      throw new UnauthorizedException('Invalid HMAC signature.');
    }
  }
}
