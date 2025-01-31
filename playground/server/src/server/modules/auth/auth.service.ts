import type { ConfigService, EmailService, ServiceOptions } from '@lenne.tech/nest-server';
import type { JwtService } from '@nestjs/jwt';

import { CoreAuthService, RoleEnum, Roles } from '@lenne.tech/nest-server';
import { Injectable } from '@nestjs/common';

import type { UserService } from '../user/user.service';
import type { AuthSignInInput } from './inputs/auth-sign-in.input';
import type { AuthSignUpInput } from './inputs/auth-sign-up.input';

import { Auth } from './auth.model';

@Injectable()
@Roles(RoleEnum.ADMIN)
export class AuthService extends CoreAuthService {
  constructor(
    protected override readonly configService: ConfigService,
    protected readonly emailService: EmailService,
    protected override readonly jwtService: JwtService,
    protected override readonly userService: UserService,
  ) {
    super(userService, jwtService, configService);
  }

  /**
   * Sign in for user
   */
  @Roles(RoleEnum.S_EVERYONE)
  override async signIn(input: AuthSignInInput, serviceOptions?: ServiceOptions): Promise<Auth> {
    return Auth.map(await super.signIn(input, serviceOptions));
  }

  /**
   * Register a new user Account
   */
  @Roles(RoleEnum.S_EVERYONE)
  override async signUp(input: AuthSignUpInput, serviceOptions?: ServiceOptions): Promise<Auth> {
    const result = await super.signUp(input, serviceOptions);
    const { user } = result;

    // Send email
    await this.emailService.sendMail(user.email, 'Welcome', {
      htmlTemplate: 'welcome',
      templateData: {
        link: `${this.configService.configFastButReadOnly.email.verificationLink}/${user.verificationToken}`,
        name: user.username,
      },
    });

    // Return mapped result
    return Auth.map(result);
  }
}
