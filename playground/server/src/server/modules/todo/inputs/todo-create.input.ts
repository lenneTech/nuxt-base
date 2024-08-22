import { Restricted, RoleEnum } from '@lenne.tech/nest-server';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { TodoInput } from './todo.input';


/**
 * Todo create input
 */
@Restricted(RoleEnum.S_EVERYONE)
@InputType({ description: 'Input data to create a new Todo' })
export class TodoCreateInput extends TodoInput {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * Name of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'Name of Todo',
    nullable: true,
  })
  @IsOptional()
  override name?: string = undefined;

  /**
   * AssigneesId of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => [String], {
    description: 'AssigneesId of Todo',
    nullable: true,
  })
  @IsOptional()
  override assignees?: string[] = undefined;

  /**
   * Description of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'Description of Todo',
    nullable: true,
  })
  @IsOptional()
  override description?: string = undefined;

  /**
   * Status of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'Status of Todo',
    nullable: true,
  })
  @IsOptional()
  override status?: string = undefined;

}
