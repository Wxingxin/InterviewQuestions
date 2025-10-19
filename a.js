function deepclone(obj) {
  if (typeof obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const deepobj = Array.isArray(obj) ? [] : {};

  for(let item of obj){
    if(obj)
  }
}
