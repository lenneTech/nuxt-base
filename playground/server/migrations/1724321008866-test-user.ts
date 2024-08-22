import {getDb} from '../migrations-utils/db';
import {Db} from 'mongodb';
import {sha256} from 'js-sha256';
import bcrypt = require('bcrypt');

export const up = async () => {
  const db: Db = await getDb();
  const user = {
    email: 'todo_user@lenne.tech',
    password: (await bcrypt.hash(sha256('asdasd'), 10)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await db.collection('users').insertOne(user);
};

export const down = async () => {
  const db: Db = await getDb();
  /*
      Code you downgrade script here!
   */
};
