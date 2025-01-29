import type { Document } from 'mongoose';

import { Restricted, RoleEnum, equalIds, mapClasses } from '@lenne.tech/nest-server';
import { Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooseSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { PersistenceModel } from '../../common/models/persistence.model';
import { User } from '../user/user.model';

export type TodoDocument = Todo & Document;

/**
 * Todo model
 */
@Restricted(RoleEnum.ADMIN)
@ObjectType({ description: 'Todo' })
@MongooseSchema({ timestamps: true })
export class Todo extends PersistenceModel {
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
  @Prop()
  name: string = undefined;

  /**
   * Description of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => String, {
    description: 'Description of Todo',
    nullable: true,
  })
  @Prop()
  description: string = undefined;

  /**
   * Assigne of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => User, {
    description: 'Assigne of Todo',
    nullable: true,
  })
  @Prop({ ref: 'User', type: Schema.Types.ObjectId })
  assigne: User = undefined;

  /**
   * Deadline of Todo
   */
  @Restricted(RoleEnum.S_EVERYONE)
  @Field(() => Number, {
    description: 'Deadline of Todo',
    nullable: true,
  })
  @Prop()
  deadline: Date = undefined;

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Initialize instance with default values instead of undefined
   */
  override init() {
    super.init();
    // this.propertyName = [];
    return this;
  }

  /**
   * Map input
   *
   * Hint: Non-primitive variables should always be mapped (see mapClasses / mapClassesAsync in ModelHelper)
   */
  override map(input) {
    super.map(input);
    // return mapClasses(input, { propertyName: PropertyModel }, this);
    return mapClasses(input, { assigne: User }, this);
  }

  /**
   * Verification of the user's rights to access the properties of this object
   *
   * Check roles, prepare or remove properties
   * Return undefined if the whole object should not be returned or throw an exception to stop the whole request
   */
  override securityCheck(user: User, force?: boolean) {
    // In force mode or for admins everything is allowed
    if (force || user?.hasRole(RoleEnum.ADMIN)) {
      return this;
    }

    // Usually only the creator has access to the object
    if (!equalIds(user, this.createdBy)) {
      return undefined;
    }

    // Check permissions for properties of this object and return the object afterward
    return this;
  }
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
