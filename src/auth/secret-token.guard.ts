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

    const secret = 'salakute';

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
    const hmac = createHmac('sha256', secret);

    hmac.update(payload);
    const generatedHmac = hmac.digest('hex');

    const expectedBuffer = Buffer.from(generatedHmac);
    const signatureBuffer = Buffer.from(signature);

    if (!timingSafeEqual(expectedBuffer, signatureBuffer)) {
      throw new UnauthorizedException('Invalid HMAC signature.');
    }

    console.log('Signature is valid');
  }
}
