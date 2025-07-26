import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GraphqlGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  getUser(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }

  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  override handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }
    if (!user) {
      throw new UnauthorizedException('Could not get token from');
    }
    if (err) {
      throw err;
    }
    return user;
  }

  async canActivate(context: ExecutionContext) {
    try {
      await super.canActivate(context);

      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException('No authentication provided');
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
