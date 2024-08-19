import { Helper } from './helper.class';

/**
 * Standard class
 * Other classes should extend the Standard class, if they offer own functions
 * If the extended class uses object properties with own map functions, it should implement its own map function
 */
export class Standard {
  /**
   * Static map method
   */
  public static map<T extends Standard>(this: new (...args: any[]) => T, data: { [key: string]: any } | Partial<T>, item: T = new this()): T {
    return (item as any).map(data);
  }

  /**
   * Map data into an object
   */
  public map(data: { [key: string]: any } | Partial<this>): this {
    return Helper.map(data, this);
  }

  /**
   * Clone object (and map additional data)
   */
  public clone(mapData?: { [key: string]: any } | Partial<this>): this {
    const current = JSON.parse(JSON.stringify(this));
    if (mapData) {
      Object.assign(current, mapData);
    }
    return new (this as any).constructor().map(current);
  }

  /**
   * Compare this with another object
   * Hint: functions will be ignored and when an array or an object is different the hole array or object will used as property value
   *
   * @return Record<string, any> with properties of this object which are different
   */
  public getDiff(compare: Record<string, any>, clone = true) {
    return Helper.getDiff(this, compare, clone);
  }
}
