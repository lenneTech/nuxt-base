import type { ConfigService } from '@lenne.tech/nest-server';

import { CoreAuthController, RoleEnum, Roles } from '@lenne.tech/nest-server';
import { Controller } from '@nestjs/common';

import type { AuthService } from './auth.service';

@Roles(RoleEnum.ADMIN)
@Controller('auth')
export class AuthController extends CoreAuthController {
  /**
   * Import project services
   */
  constructor(
    protected override readonly authService: AuthService,
    protected override readonly configService: ConfigService,
  ) {
    super(authService, configService);
  }
}
