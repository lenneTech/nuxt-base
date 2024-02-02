export function useHelper() {
  function removeFields(obj: any, fieldsToRemove?: string[]): any {
    let ignoreFields = ['id', '__typename', '__init'];
    if (fieldsToRemove) {
      ignoreFields = ignoreFields.concat(fieldsToRemove);
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => removeFields(item, ignoreFields));
    } else if (obj instanceof Date) {
      return obj;
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const key in obj) {
        if (!ignoreFields.includes(key)) {
          newObj[key] = removeFields(obj[key], ignoreFields);
        }
      }
      return Object.keys(newObj).length ? newObj : undefined;
    } else {
      return obj;
    }
  }

  function removeNullOrUndefined(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => removeNullOrUndefined(item)).filter((item) => item !== null && item !== undefined);
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const key in obj) {
        const value = removeNullOrUndefined(obj[key]);
        if (value !== null && value !== undefined) {
          newObj[key] = value;
        }
      }
      return newObj;
    } else {
      return obj;
    }
  }

  function isValidMongoID(id: string): boolean {
    const validHexChars = /^[0-9a-fA-F]{24}$/;

    return validHexChars.test(id);
  }

  function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
      const groupKey = fn(curr);
      const group = prev[groupKey] || [];
      group.push(curr);
      return { ...prev, [groupKey]: group };
    }, {});
  }

  function getDifferences(obj1: any, obj2: any): any {
    // Nothing to do
    if (obj1 === obj2) {
      return undefined;
    }

    // Check direct cases
    if (
      typeof obj1 !== typeof obj2 ||
      typeof obj1 !== 'object' ||
      !obj1 ||
      !obj2 ||
      ((Array.isArray(obj1) || obj1 instanceof Date) && JSON.stringify(obj1) !== JSON.stringify(obj2))
    ) {
      return obj2;
    }

    // Check file
    if (obj2 instanceof File && obj1.id && obj1.filename && obj1.chunkSize && obj1.contentType) {
      return obj1?.chunkSize !== obj2?.size || obj1?.filename !== obj2?.name ? obj2 : undefined;
    }

    // Get changes
    const diff: Record<string, any> = {};
    for (const key of Object.keys(obj2)) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        diff[key] = getDifferences(obj1[key], obj2[key]);
      }
    }
    return Object.keys(diff).length ? diff : undefined;
  }

  return { getDifferences, groupBy, isValidMongoID, removeFields, removeNullOrUndefined };
}
