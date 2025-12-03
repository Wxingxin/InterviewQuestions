function a(thisArg, ...args) {
  const ctx =
    thisArg === null || thisArg === undefined ? globalThis : Object(thisArg);

  const key = Symbol("tempFn");
  ctx[key] = this;

  const result = ctx[key](...args);

  delete ctx[key];

  return result;
}
