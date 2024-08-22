import { CoreInput, Restricted, RoleEnum } from '@lenne.tech/nest-server';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * Todo input
 */
@Restricted(RoleEnum.S_EVERYONE)
@InputType({ description: 'Input data to update an existing Todo' })
export class TodoInput extends CoreInput {

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
  name?: string = undefined;

  /**
   * AssigneesId of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => [String], {
    description: 'AssigneesId of Todo',
    nullable: true,
  })
  @IsOptional()
  assignees?: string[] = undefined;

  /**
   * Description of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'Description of Todo',
    nullable: true,
  })
  @IsOptional()
  description?: string = undefined;

  /**
   * Status of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'Status of Todo',
    nullable: true,
  })
  @IsOptional()
  status?: string = undefined;

}
