import type { Db } from 'mongodb';

import { sha256 } from 'js-sha256';

import { getDb } from '../migrations-utils/db';

// eslint-disable-next-line @typescript-eslint/no-require-imports
import bcrypt = require('bcrypt');

export const up = async () => {
  const db: Db = await getDb();
  const user = {
    createdAt: new Date(),
    email: 'todo_user@lenne.tech',
    password: await bcrypt.hash(sha256('asdasd'), 10),
    updatedAt: new Date(),
  };
  await db.collection('users').insertOne(user);
};

export const down = async () => {
  const db: Db = await getDb();
  /*
      Code you downgrade script here!
   */
};
