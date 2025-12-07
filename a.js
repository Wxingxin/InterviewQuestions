const data = { a: 1, b: { c: 2 } };

JSON.stringify(data, null, 2);
// {
//   "a": 1,
//   "b": {
//     "c": 2
//   }
// }

JSON.stringify(data, null, 4);     // 4个空格缩进
console.log(JSON.stringify(data, null, '\t'))// 用制表符缩进
console.log(JSON.stringify(data, null, '→'));   // 自定义缩进符号（最多10字符）