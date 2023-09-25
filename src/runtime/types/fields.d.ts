export type SimpleTypes = string | number | boolean | Date | string[] | number[] | boolean[] | Date[];

export type UnArray<T> = T extends Array<infer U> ? UnArray<U> : T;

export type SimpleKeysFromObject<T> = { [K in keyof T]: T[K] extends SimpleTypes ? K : never; }[keyof T];

export type SubFields<T extends object, K extends keyof T = keyof T> =
    K extends SimpleKeysFromObject<T> ?
      K :
      T[K] extends any[] ?
          { [P in K]: UnArray<T[P]> extends object ?
            SubFields<Required<UnArray<T[P]>>>[] :
            never } :
          {
            [P in K]: T[P] extends object ?
              SubFields<Required<T[P]>>[] :
              never
          };

export type InputFields<T> = SubFields<Required<T>>;
