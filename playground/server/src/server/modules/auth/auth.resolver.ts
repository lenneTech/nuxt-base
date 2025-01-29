import type { ConfigService, ServiceOptions } from '@lenne.tech/nest-server';
import type { Response as ResponseType } from 'express';

import { CoreAuthResolver, GraphQLServiceOptions, RoleEnum, Roles } from '@lenne.tech/nest-server';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import type { AuthService } from './auth.service';
import type { AuthSignUpInput } from './inputs/auth-sign-up.input';

import { Auth } from './auth.model';
import { AuthSignInInput } from './inputs/auth-sign-in.input';

/**
 * Authentication resolver for the sign in
 */
@Roles(RoleEnum.ADMIN)
@Resolver(() => Auth)
export class AuthResolver extends CoreAuthResolver {
  /**
   * Integrate services
   */
  constructor(
    protected override readonly authService: AuthService,
    protected override readonly configService: ConfigService,
  ) {
    super(authService, configService);
  }

  /**
   * SignIn for User
   */
  @Roles(RoleEnum.S_EVERYONE)
  @Mutation(() => Auth, { description: 'Sign in and get JWT token' })
  override async signIn(
    @GraphQLServiceOptions({ gqlPath: 'signIn.user' }) serviceOptions: ServiceOptions,
    @Context() ctx: { res: ResponseType },
    @Args('input') input: AuthSignInInput,
  ): Promise<Auth> {
    const result = await this.authService.signIn(input, {
      ...serviceOptions,
      inputType: AuthSignInInput,
    });
    return this.processCookies(ctx, result);
  }

  /**
   * Sign up for user
   */
  @Roles(RoleEnum.S_EVERYONE)
  @Mutation(() => Auth, {
    description: 'Sign up user and get JWT token',
  })
  override async signUp(
    @GraphQLServiceOptions({ gqlPath: 'signUp.user' }) serviceOptions: ServiceOptions,
    @Context() ctx: { res: ResponseType },
    @Args('input') input: AuthSignUpInput,
  ): Promise<Auth> {
    const result = await this.authService.signUp(input, serviceOptions);
    return this.processCookies(ctx, result);
  }
}
