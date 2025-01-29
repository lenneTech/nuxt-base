import type { ConfigService } from '@lenne.tech/nest-server';

import { Injectable } from '@nestjs/common';

import { Meta } from './meta.model';

import metaData = require('../../../meta.json');

/**
 * Meta service
 */
@Injectable()
export class MetaService {
  // ===================================================================================================================
  // Injections
  // ===================================================================================================================

  /**
   * Constructor for injecting services
   */
  constructor(protected readonly configService: ConfigService) {}

  /**
   * Get Meta via ID
   * Is used by MetaResolver AND ServerController!
   */
  async get(): Promise<Meta> {
    return Meta.map({
      environment: this.configService.config.env,
      package: metaData.name,
      title: metaData.description,
      version: metaData.version,
    });
  }
}
