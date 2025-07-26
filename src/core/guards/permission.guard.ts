import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  InternalServerErrorException,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Auth0Service } from '../../auth0/services';
import { GraphqlGuard } from './graphql.guard';

export const PermissionGuard = (permissions: string[]): Type<CanActivate> => {
  class PermissionGuardMixin extends GraphqlGuard {
    constructor(
      @Inject(Auth0Service) private readonly auth0Service: Auth0Service,
    ) {
      super();
    }

    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      if (permissions.length === 0) {
        throw new InternalServerErrorException('No permissions provided');
      }

      try {
        const user = this.getUser(context);
        console.log('user', user);
        const userPermissions = await lastValueFrom(
          this.auth0Service.getUserPermissions(user.auth0Id),
        );

        if (
          !permissions.every((permission) =>
            userPermissions.includes(permission),
          )
        ) {
          throw new UnauthorizedException(
            'User does not have required permissions',
          );
        }

        return true;
      } catch (err) {
        console.error(err);
        if (err instanceof HttpException) {
          throw err;
        }
        return false;
      }
    }
  }
  return mixin(PermissionGuardMixin);
};
