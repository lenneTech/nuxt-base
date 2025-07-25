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
    const result = arr.reduce<Record<string, T[]>>((prev, curr) => {
      const groupKey = fn(curr);
      const group = prev[groupKey] || [];
      group.push(curr);
      return { ...prev, [groupKey]: group };
    }, {});

    // sort alphabetically
    return Object.keys(result)
      .sort()
      .reduce<Record<string, T[]>>((prev, curr) => {
        prev[curr] = result[curr];
        return prev;
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

  function slugifyDomain(input: string, allowDots = false) {
    const specialChars = {
      ä: 'ae',
      ö: 'oe',
      ß: 'ss',
      ü: 'ue',
    };
    const a = 'àáâæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôòóœøōõőṕŕřśšşșťțûùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrssssttuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');
  
    let result = input
      .toString()
      .toLowerCase()
      .replace(/[äöüß]/gi, (matched) => specialChars[matched.toLowerCase()]) // German special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-') // Replace & with -
      .replace(/\-\-+/g, '-') // Collapse multiple -
      .replace(/^-+/, '') // Trim leading -
      .replace(/-+$/, ''); // Trim trailing -

    if (allowDots) {
      result = result.replace(/[^\w\-.]+/g, ''); // Removes all non-word characters except for dots
    } else {
      result = result.replace(/[^\w\-]+/g, ''); // Remove all non-word characters
    }

    return result;
  }

  function hashCode(input: any) {
    let str: string;

    if (!input) {
      return 0;
    }

    if (typeof input === 'string') {
      str = input;
    } else {
      str = JSON.stringify(input);
    }

    if (!str) {
      return 0;
    }

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    return hash;
  }

  function generateUniqueHash(): string {
    const now = Date.now();
    const random = Math.random();
    const input = now.toString() + random.toString();

    let hash = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    return hash.toString(16);
  }

  return { generateUniqueHash, getDifferences, groupBy, hashCode, isValidMongoID, removeFields, removeNullOrUndefined, slugifyDomain };
}
