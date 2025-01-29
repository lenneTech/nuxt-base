import { CurrentUser, RoleEnum, Roles, multerOptionsForImageUpload } from '@lenne.tech/nest-server';
import { Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

import type { User } from './user.model';
import type { UserService } from './user.service';

import envConfig from '../../../config.env';

/**
 * Controller for avatar
 */
@Roles(RoleEnum.ADMIN)
@Controller('avatar')
export class AvatarController {
  /**
   * Import services
   */
  constructor(protected readonly usersService: UserService) {}

  /**
   * Upload files
   */
  @Roles(RoleEnum.S_USER)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerOptionsForImageUpload({
        destination: `${envConfig.staticAssets.path}/avatars`,
      }),
    ),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User): Promise<string> {
    return this.usersService.setAvatar(file, user);
  }
}
