import type { Db } from 'mongodb';

import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db: Db = await getDb();
  /*
      Code your update script here!
   */
};

export const down = async () => {
  const db: Db = await getDb();
  /*
      Code you downgrade script here!
   */
};
