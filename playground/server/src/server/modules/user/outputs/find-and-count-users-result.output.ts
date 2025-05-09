import { Restricted, RoleEnum } from '@lenne.tech/nest-server';
import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../user.model';

@Restricted(RoleEnum.ADMIN)
@ObjectType({ description: 'Result of find and count' })
export class FindAndCountUsersResult {
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => [User], { description: 'Found users' })
  items: User[];

  @Restricted(RoleEnum.S_EVERYONE)
  @Field({ description: 'Total count (skip/offset and limit/take are ignored in the count)' })
  totalCount: number;
}
