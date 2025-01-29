import type { DynamicModule } from '@nestjs/common';
import type { JwtModuleOptions } from '@nestjs/jwt';

import { CoreAuthModule, EmailService } from '@lenne.tech/nest-server';
import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

/**
 * CoreAuthModule to handle user authentication
 */
@Module({})
export class AuthModule {
  /**
   * Dynamic module
   * see https://docs.nestjs.com/modules#dynamic-modules
   */
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      exports: [AuthController, AuthResolver, CoreAuthModule],
      imports: [
        CoreAuthModule.forRoot(UserModule, UserService, {
          ...options,
          ...{
            // imports: [], // Integrate additional Services here to resolve dependencies
            // providers: [] // Integrate additional Providers here to resolve dependencies
          },
        }),
      ],
      module: AuthModule,
      providers: [AuthController, AuthResolver, AuthService, EmailService],
    };
  }
}
