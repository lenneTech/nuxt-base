import type { ServiceOptions } from '@lenne.tech/nest-server';
import type { PubSub } from 'graphql-subscriptions';

import { FilterArgs, GraphQLServiceOptions, RoleEnum, Roles } from '@lenne.tech/nest-server';
import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import type { TodoService } from './todo.service';

import { TodoInput } from './inputs/todo.input';
import { TodoCreateInput } from './inputs/todo-create.input';
import { FindAndCountTodosResult } from './outputs/find-and-count-todos-result.output';
import { Todo } from './todo.model';

/**
 * Resolver to process with Todo data
 */
@Roles(RoleEnum.ADMIN)
@Resolver(() => Todo)
export class TodoResolver {
  /**
   * Import services
   */
  constructor(
    private readonly todoService: TodoService,
    @Inject('PUB_SUB') protected readonly pubSub: PubSub,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  /**
   * Get and total count Todos (via filter)
   */
  @Roles(RoleEnum.S_USER)
  @Query(() => FindAndCountTodosResult, { description: 'Find Todos (via filter)' })
  async findAndCountTodos(
    @GraphQLServiceOptions({ gqlPath: 'findAndCountTodos.items' }) serviceOptions: ServiceOptions,
    @Args() args?: FilterArgs,
  ) {
    return await this.todoService.findAndCount(args, {
      ...serviceOptions,
      inputType: FilterArgs,
    });
  }

  /**
   * Get Todos (via filter)
   */
  @Roles(RoleEnum.S_USER)
  @Query(() => [Todo], { description: 'Find Todos (via filter)' })
  async findTodos(@GraphQLServiceOptions() serviceOptions: ServiceOptions, @Args() args?: FilterArgs) {
    return await this.todoService.find(args, {
      ...serviceOptions,
      inputType: FilterArgs,
    });
  }

  /**
   * Get Todo via ID
   */
  @Roles(RoleEnum.S_USER)
  @Query(() => Todo, { description: 'Get Todo with specified ID' })
  async getTodo(@GraphQLServiceOptions() serviceOptions: ServiceOptions, @Args('id') id: string): Promise<Todo> {
    return await this.todoService.get(id, serviceOptions);
  }

  // ===========================================================================
  // Mutations
  // ===========================================================================

  /**
   * Create new Todo
   */
  @Roles(RoleEnum.S_USER)
  @Mutation(() => Todo, { description: 'Create a new Todo' })
  async createTodo(
    @GraphQLServiceOptions() serviceOptions: ServiceOptions,
    @Args('input') input: TodoCreateInput,
  ): Promise<Todo> {
    return await this.todoService.create(input, {
      ...serviceOptions,
      inputType: TodoCreateInput,
    });
  }

  /**
   * Delete existing Todo
   */
  @Roles(RoleEnum.S_USER)
  @Mutation(() => Todo, { description: 'Delete existing Todo' })
  async deleteTodo(@GraphQLServiceOptions() serviceOptions: ServiceOptions, @Args('id') id: string): Promise<Todo> {
    return await this.todoService.delete(id, {
      ...serviceOptions,
      roles: [RoleEnum.ADMIN, RoleEnum.S_CREATOR],
    });
  }

  /**
   * Update existing Todo
   */
  @Roles(RoleEnum.S_USER)
  @Mutation(() => Todo, { description: 'Update existing Todo' })
  async updateTodo(
    @GraphQLServiceOptions() serviceOptions: ServiceOptions,
    @Args('id') id: string,
    @Args('input') input: TodoInput,
  ): Promise<Todo> {
    return await this.todoService.update(id, input, {
      ...serviceOptions,
      inputType: TodoInput,
      roles: [RoleEnum.ADMIN, RoleEnum.S_CREATOR],
    });
  }

  @Roles(RoleEnum.S_USER)
  @Mutation(() => Todo, { description: 'error Todo' })
  async errorTodo(@GraphQLServiceOptions() serviceOptions: ServiceOptions, @Args('id') id: string): Promise<Todo> {
    throw new NotFoundException('Error Todo');
  }

  // ===========================================================================
  // Subscriptions
  // ===========================================================================

  /**
   * Subscription for create Todo
   */
  @Subscription(() => Todo, {
    resolve: (value) => value,
  })
  async todoCreated() {
    return this.pubSub.asyncIterator('todoCreated');
  }
}
