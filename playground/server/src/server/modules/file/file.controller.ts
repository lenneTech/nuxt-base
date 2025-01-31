import { RoleEnum, Roles } from '@lenne.tech/nest-server';
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { FileService } from './file.service';

/**
 * File controller for
 */
@Roles(RoleEnum.ADMIN)
@Controller('files')
export class FileController {
  /**
   * Import services
   */
  constructor(private readonly fileService: FileService) {}

  /**
   * Upload file
   */
  @Roles(RoleEnum.ADMIN)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): any {
    return file;
  }

  /**
   * Download file
   */
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res) {
    if (!id) {
      throw new UnprocessableEntityException();
    }

    let file;
    try {
      file = await this.fileService.getFileInfo(id);
    } catch (e) {
      console.error(e);
    }

    if (!file) {
      throw new NotFoundException();
    }
    const filestream = await this.fileService.getFileStream(id);
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', `attachment; filename=${file.filename}`);
    res.header('Cache-Control', 'max-age=31536000');
    return filestream.pipe(res);
  }

  /**
   * Get file information
   */
  @Roles(RoleEnum.ADMIN)
  @Get('info/:id')
  async getFileInfo(@Param('id') id: string) {
    return await this.fileService.getFileInfo(id);
  }

  /**
   * Delete file
   */
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    if (!id) {
      throw new UnprocessableEntityException();
    }

    return await this.fileService.deleteFile(id);
  }
}
