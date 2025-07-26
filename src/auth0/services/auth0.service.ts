import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { envs } from '../../core/config';
import { Auth0Permission } from '../../core/types';
import { RedisService } from '../../redis/service';

@Injectable()
export class Auth0Service {
  private readonly logger: Logger;
  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {
    this.logger = new Logger(Auth0Service.name);
  }

  getMgmtAccessToken(): Observable<string> {
    return from(this.redisService.retrieveString('auth0AccessToken')).pipe(
      switchMap((token) => {
        if (token) {
          return of(token);
        }
        return this._getMgmtAccessToken().pipe(
          switchMap((token) =>
            from(
              this.redisService
                .storeString('auth0AccessToken', token, 24 * 60 * 60)
                .then(() => token)
                .catch((err) => {
                  console.error(err);
                  return token;
                }),
            ),
          ),
        );
      }),
      catchError((error) => {
        console.log('error.message', error);
        throw new ServiceUnavailableException(
          'Unable to fetch token from Auth0',
        );
      }),
    );
  }

  _getMgmtAccessToken(): Observable<string> {
    return this.httpService
      .post(`${envs.auth0UrlDomain}/oauth/token`, {
        client_id: envs.auth0MgmtClientId,
        client_secret: envs.auth0MgmtClientSecret,
        audience: envs.auth0MgmtAudience,
        grant_type: 'client_credentials',
      })
      .pipe(
        map(
          (response: AxiosResponse<{ access_token: string }>) =>
            response.data.access_token,
        ),
        catchError((error: AxiosError) => {
          this.logger.error(error.request);
          this.logger.error(error.response);
          throw new ServiceUnavailableException(
            'Unable to fetch token from Auth0',
          );
        }),
      );
  }

  getUserPermissions(auth0UserSub: string): Observable<string[]> {
    return this.getMgmtAccessToken().pipe(
      switchMap((token) => {
        return this.httpService.get(
          `${envs.auth0UrlDomain}/api/v2/users/${auth0UserSub}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }),
      map((response: AxiosResponse<Auth0Permission[]>) => {
        console.log('response', response);
        return response.data.map((permission) => permission.permission_name);
      }),
      catchError((error) => {
        console.log('error.message', error);
        throw new ServiceUnavailableException(
          'Unable to fetch permissions from Auth0',
        );
      }),
    );
  }
}
