function deepclone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const deepobj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.getOwnProperty(key)) {
      deepobj[key] = deepclone(obj[key]);
    }
  }

  return deepobj;
}
