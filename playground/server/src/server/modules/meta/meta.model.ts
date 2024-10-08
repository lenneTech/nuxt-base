import { CoreModel, Restricted, RoleEnum } from '@lenne.tech/nest-server';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Meta model
 */
@Restricted(RoleEnum.ADMIN)
@ObjectType({ description: 'Metadata of API' })
export class Meta extends CoreModel {
  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * Environment of API
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field({ description: 'Environment of API' })
  environment: string = undefined;

  /**
   * Name of API
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field({ description: 'Title of API' })
  title: string = undefined;

  /**
   * Package title of API
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field({ description: 'Package name of API' })
  package: string = undefined;

  /**
   * Version of API
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field({ description: 'Version of API' })
  version: string = undefined;

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Initialize instance with default values instead of undefined
   */
  override init() {
    super.init();
    // Nothing more to initialize yet
    return this;
  }

  /**
   * Map input
   */
  override map(input) {
    super.map(input);
    // There is nothing to map yet. Non-primitive variables should always be mapped.
    // If something comes up, you can use `mapClasses` / `mapClassesAsync` from ModelHelper.
    return this;
  }
}
