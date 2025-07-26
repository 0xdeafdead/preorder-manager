import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers.authorization;
    if (!apiKey) {
      throw new UnauthorizedException('No authentication provided');
    }
    if (apiKey === process.env.AUTH0_ACTION_API_KEY) {
      return true;
    }
    throw new ForbiddenException();
  }
}
