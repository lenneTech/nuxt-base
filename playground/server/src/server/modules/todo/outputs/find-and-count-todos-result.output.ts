import { Field, ObjectType } from '@nestjs/graphql';

import { Todo } from '../todo.model';

@ObjectType({ description: 'Result of find and count Todos' })
export class FindAndCountTodosResult {
  @Field(() => [Todo], { description: 'Found Todos' })
  items: Todo[];

  @Field({ description: 'Total count (skip/offset and limit/take are ignored in the count)' })
  totalCount: number;
}
