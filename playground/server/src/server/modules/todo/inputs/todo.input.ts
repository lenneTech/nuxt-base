import { CoreInput, Restricted, RoleEnum } from '@lenne.tech/nest-server';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * Todo input
 */
@Restricted(RoleEnum.ADMIN)
@InputType({ description: 'Input data to update an existing Todo' })
export class TodoInput extends CoreInput {
  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  test = 'GOLDGOLDGOLDGOLD';

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
   * AssigneId of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'AssigneId of Todo',
    nullable: true,
  })
  @IsOptional()
  assigne?: string = undefined;

  /**
   * Deadline of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => Number, {
    description: 'Deadline of Todo',
    nullable: true,
  })
  @IsOptional()
  deadline?: Date = undefined;
}
