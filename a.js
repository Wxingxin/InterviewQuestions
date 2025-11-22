// loaders/strip-console-loader.js
const { validate } = require('schema-utils');

/**
 * 配置项的校验规则
 * 方便在使用 loader 时给出更友好的报错提示
 */
const schema = {  
  type: 'object',
  properties: {
    methods: {
      type: 'array',
      items: { type: 'string' },
      description: '需要移除的 console 方法名，比如 ["log", "warn"]'
    }
  },
  additionalProperties: false
};

module.exports = function stripConsoleLoader(source) {
  // 声明这是一个可缓存的 loader（输入一样就不需要重复执行）
  if (this.cacheable) {
    this.cacheable();
  }

  // 通过 schema-utils + this.getOptions 拿到并校验 options（webpack5 写法）
  const options = this.getOptions ? this.getOptions() : {};
  validate(schema, options, {
    name: 'strip-console-loader'
  });

  // 默认要删除的 console 方法
  const methods = options.methods || ['log', 'warn', 'error', 'info', 'debug'];

  let code = source;

  // 简单用正则粗暴删除 console.xxx(...) 语句
  // 不做 AST 解析是为了保持难度适中
  methods.forEach((method) => {
    const reg = new RegExp(
      // \bconsole.method(...)  ;?  换行也能删
      String.raw`\bconsole\.${method}\s*\([^;]*\);?`,
      'g'
    );
    code = code.replace(reg, '');
  });

  // 这里是同步 loader，直接 return 处理后的源码
  return code;
};