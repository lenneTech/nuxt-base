import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';

import { ServerModule } from '../src/server/server.module';

const run = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ServerModule],
  }).compile();
  const app: any = moduleFixture.createNestApplication();
  await app.init();
  await app.close();
  process.exit(0);
};
run();
