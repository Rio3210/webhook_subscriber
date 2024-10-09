import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly staticToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmZiYjFiMTZmYzY0NTVhNGRkMjBlZjkiLCJpYXQiOjE3Mjc4NzA4NzcsImV4cCI6MTcyNzg3NDQ3NywiYXVkIjoibGNhbGhvc3Q6MzAwMCIsImlzcyI6ImxvY2FsaG9zdDozMDAwIn0.rpc9uHATsl9zt3DIbb8gHOnENzarFfLUebSmPo9Se1c';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (token === this.staticToken) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
