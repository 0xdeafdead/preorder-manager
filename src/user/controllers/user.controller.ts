import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeyGuard } from 'src/core/guards';
import { CreateUserFromAuth0Input } from '../inputs';
import { User } from '../schemas';
import { UserService } from '../services';

@Controller('user-management')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user-from-auth0')
  //Auth0 exclusive endpoint
  @UseGuards(ApiKeyGuard)
  createUserFromAuth0(
    @Body('input') input: CreateUserFromAuth0Input,
  ): Observable<User> {
    return this.userService.upsert(input);
  }
}
