import { ConfigService } from '@lenne.tech/nest-server';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';

import { UserModule } from '../user/user.module';
import { Todo, TodoSchema } from './todo.model';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

/**
 * Todo module
 */
@Module({
  controllers: [],
  exports: [MongooseModule, TodoResolver, TodoService],
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [
    ConfigService,
    TodoResolver,
    TodoService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class TodoModule {}
