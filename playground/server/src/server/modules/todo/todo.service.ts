import type { ConfigService, ServiceOptions } from '@lenne.tech/nest-server';
import type { PubSub } from 'graphql-subscriptions';
import type { Model } from 'mongoose';

import { CrudService, assignPlain } from '@lenne.tech/nest-server';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type { TodoInput } from './inputs/todo.input';
import type { TodoCreateInput } from './inputs/todo-create.input';
import type { TodoDocument } from './todo.model';

import { Todo } from './todo.model';

/**
 * Todo service
 */
@Injectable()
export class TodoService extends CrudService<Todo, TodoCreateInput, TodoInput> {
  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  // ===================================================================================================================
  // Injections
  // ===================================================================================================================

  /**
   * Constructor for injecting services
   *
   * Hints:
   * To resolve circular dependencies, integrate services as follows:
   * @Inject(forwardRef(() => XxxService)) protected readonly xxxService: WrapperType<XxxService>
   */
  constructor(
    protected override readonly configService: ConfigService,
    @InjectModel('Todo') protected readonly todoModel: Model<TodoDocument>,
    @Inject('PUB_SUB') protected readonly pubSub: PubSub,
  ) {
    super({ configService, mainDbModel: todoModel, mainModelConstructor: Todo });
  }

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Create new Todo
   * Overwrites create method from CrudService
   */
  override async create(input: TodoCreateInput, serviceOptions?: ServiceOptions): Promise<Todo> {
    // Get new Todo
    const createdTodo = await super.create(input, serviceOptions);

    // Inform subscriber
    await this.pubSub.publish('todoCreated', Todo.map(createdTodo));

    // Return created Todo
    return createdTodo;
  }

  /**
   * Example method
   * Extends the CrudService
   */
  async exampleMethod(id: string, input: Record<string, any>, serviceOptions?: ServiceOptions): Promise<Todo> {
    // Get and check Todo
    const todo = await this.mainDbModel.findById(id).exec();
    if (!todo) {
      throw new NotFoundException(`Todo not found with ID: ${id}`);
    }

    // Process input and output
    return await this.process(
      async (data) => {
        // Update, save and return Todo
        return await assignPlain(todo, data.input).save();
      },
      { input, serviceOptions },
    );
  }
}
