import { Restricted, RoleEnum } from '@lenne.tech/nest-server';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { TodoInput } from './todo.input';


/**
 * Todo create input
 */
@Restricted(RoleEnum.ADMIN)
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
    nullable: false,
  })
  override name: string = undefined;
      
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
   * AssigneId of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'AssigneId of Todo',
    nullable: true,
  })
  @IsOptional()
  override assigne?: string = undefined;
      
  /**
   * Deadline of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => Number, {
    description: 'Deadline of Todo',
    nullable: true,
  })
  @IsOptional()
  override deadline?: Date = undefined;
  
}
