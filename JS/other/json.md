### 1. **JSON 基础**

#### 1.1 什么是 JSON？

- **定义**: JSON 是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。它是基于 JavaScript 对象表示法的文本格式。
- **语法结构**:

  - **对象**: `{}` 包裹的键值对集合，键必须是字符串。
  - **数组**: `[]` 包裹的有序数据集合。
  - **数据类型**: 字符串、数字、布尔值、数组、对象、`null`。

```json
{
  "name": "John",
  "age": 30,
  "isStudent": false,
  "courses": ["Math", "Science"],
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
```

#### 1.2 JSON 和 JavaScript 对象的区别

- JSON 只能表示数据结构（没有方法和函数等）。
- JavaScript 对象包含方法和属性，可以执行代码。

### 2. **JSON 的解析与生成**

#### 2.1 JSON.parse()

- **作用**: 将 JSON 字符串转换为 JavaScript 对象。
- **使用示例**:

```js
const jsonString = '{"name": "John", "age": 30}';
const jsonObj = JSON.parse(jsonString);
console.log(jsonObj.name); // "John"
```

#### 2.2 JSON.stringify()

- **作用**: 将 JavaScript 对象转换为 JSON 字符串。
- **使用示例**:

```js
const obj = { name: "John", age: 30 };
const jsonString = JSON.stringify(obj);
console.log(jsonString); // '{"name":"John","age":30}'
```

### 3. **JSON 与前端的应用**

#### 3.1 通过 Fetch API 获取 JSON 数据

- **从服务器获取 JSON 数据并解析**：

```js
fetch("https://api.example.com/data")
  .then((response) => response.json()) // 解析 JSON
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### 3.2 将 JSON 数据发送到后端

- **POST 请求发送 JSON 数据**：

```js
const data = {
  name: "John",
  age: 30,
};

fetch("https://api.example.com/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
})
  .then((response) => response.json())
  .then((result) => console.log("Success:", result))
  .catch((error) => console.error("Error:", error));
```

### 4. **JSON 进阶使用**

#### 4.1 JSON Schema

- **JSON Schema** 用于描述 JSON 数据的结构，可以帮助进行数据验证和约束。
- **示例**: 一个简单的 JSON Schema 描述用户数据。

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer"
    }
  },
  "required": ["name", "age"]
}
```

#### 4.2 使用 JSONP 实现跨域请求

- **JSONP** (JSON with Padding) 是一种通过 `<script>` 标签进行跨域请求的技术，主要用于早期的跨域问题。

```js
function handleResponse(data) {
  console.log(data);
}

const script = document.createElement("script");
script.src = "https://api.example.com/jsonp?callback=handleResponse";
document.body.appendChild(script);
```

#### 4.3 序列化与反序列化

- **深度拷贝**: 使用 `JSON.parse()` 和 `JSON.stringify()` 可以进行对象的深度拷贝。

```js
const obj = { name: "John", details: { age: 30 } };
const deepCopy = JSON.parse(JSON.stringify(obj));
```

### 5. **性能优化与注意事项**

#### 5.1 JSON 大数据的处理

- 对于大数据量的 JSON，可以通过流式处理、分页加载等方式避免一次性加载大量数据导致性能问题。

#### 5.2 JSON 与浏览器存储

- JSON 数据通常被用来在前端存储和读取数据，例如 `localStorage` 和 `sessionStorage`。

```js
// 存储
localStorage.setItem("user", JSON.stringify({ name: "John", age: 30 }));

// 读取
const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name); // "John"
```

### 6. **工具与库**

- **JSONLint**: 在线工具，用于验证 JSON 的正确性。
- **AJV**: 一个 JSON Schema 验证器库。
- **json-server**: 用于快速构建一个假的 REST API，支持 JSON 数据作为数据库。

---

`JSON.parse()` 和 `JSON.stringify()` 是 JavaScript 中处理 JSON 数据的两个核心方法。它们在前端开发中被广泛使用，尤其是在数据交换、存储和传输过程中。下面是这两个方法的详细使用方法大全。

### 1. **`JSON.parse()`**

#### 1.1 基本用法

- **作用**: 将 JSON 格式的字符串解析为 JavaScript 对象。
- **语法**: `JSON.parse(text, reviver)`

  - `text`: 一个符合 JSON 格式的字符串。
  - `reviver`（可选）: 一个函数，允许在转换过程中修改每个键值对。

##### 示例：

```js
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString);
console.log(obj); // { name: "John", age: 30 }
```

#### 1.2 使用 `reviver` 函数修改解析过程

- `reviver` 函数可以让你对解析的每个键值对进行转换或过滤。

##### 示例：

```js
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString, (key, value) => {
  if (key === "age") return value + 1; // 修改 age 字段的值
  return value;
});
console.log(obj); // { name: "John", age: 31 }
```

#### 1.3 解析无效 JSON 字符串

- 如果传入的字符串不是有效的 JSON 格式，`JSON.parse()` 会抛出 `SyntaxError`。

##### 示例：

```js
const invalidJson = '{"name": "John", age: 30}'; // 错误：age 没有双引号
try {
  const obj = JSON.parse(invalidJson);
} catch (error) {
  console.error("Invalid JSON:", error); // 捕获错误
}
```

#### 1.4 解析嵌套 JSON 对象

- `JSON.parse()` 可以递归地解析多层嵌套的 JSON 对象。

##### 示例：

```js
const jsonString = '{"person": {"name": "John", "age": 30}}';
const obj = JSON.parse(jsonString);
console.log(obj.person.name); // "John"
```

### 2. **`JSON.stringify()`**

#### 2.1 基本用法

- **作用**: 将 JavaScript 对象转换为 JSON 格式的字符串。
- **语法**: `JSON.stringify(value, replacer, space)`

  - `value`: 需要转换的 JavaScript 对象。
  - `replacer`（可选）: 可以是数组或函数，用来控制哪些属性会被包含在返回的 JSON 字符串中。
  - `space`（可选）: 用于格式化输出的空格或缩进，可以是数字或字符串。

##### 示例：

```js
const obj = { name: "John", age: 30 };
const jsonString = JSON.stringify(obj);
console.log(jsonString); // '{"name":"John","age":30}'
```

#### 2.2 使用 `replacer` 过滤属性

- `replacer` 可以是一个数组或函数，用来指定哪些键会被包含在生成的 JSON 字符串中。

##### 示例：

1. **使用数组作为 `replacer`**:

   - 只有数组中的属性会被转换为 JSON。

```js
const obj = { name: "John", age: 30, city: "New York" };
const jsonString = JSON.stringify(obj, ["name", "age"]);
console.log(jsonString); // '{"name":"John","age":30}'
```

2. **使用函数作为 `replacer`**:

   - 自定义如何转换对象中的每个属性。

```js
const obj = { name: "John", age: 30, city: "New York" };
const jsonString = JSON.stringify(obj, (key, value) => {
  if (key === "age") return undefined; // 过滤掉 age 属性
  return value;
});
console.log(jsonString); // '{"name":"John","city":"New York"}'
```

#### 2.3 格式化 JSON 字符串（`space` 参数）

- 使用 `space` 参数来格式化输出的 JSON 字符串，使其更易读。

##### 示例：

1. **使用空格缩进**:

```js
const obj = { name: "John", age: 30, city: "New York" };
const jsonString = JSON.stringify(obj, null, 2); // 缩进 2 个空格
console.log(jsonString);
/*
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
*/
```

2. **使用自定义字符作为缩进**:

```js
const obj = { name: "John", age: 30, city: "New York" };
const jsonString = JSON.stringify(obj, null, "--");
console.log(jsonString);
/*
{
--"name": "John",
--"age": 30,
--"city": "New York"
}
*/
```

#### 2.4 处理循环引用

- 如果对象中有循环引用，`JSON.stringify()` 会抛出错误。你可以使用 `replacer` 来解决这个问题。

##### 示例：

```js
const obj = { name: "John" };
obj.self = obj; // 循环引用

try {
  const jsonString = JSON.stringify(obj);
} catch (error) {
  console.error("Circular reference error:", error);
}
```

可以使用 `replacer` 函数来避免循环引用：

```js
const obj = { name: "John" };
obj.self = obj;

const jsonString = JSON.stringify(obj, (key, value) => {
  if (key === "self") return undefined; // 忽略循环引用
  return value;
});
console.log(jsonString); // '{"name":"John"}'
```

#### 2.5 处理特殊数据类型

- `JSON.stringify()` 对特殊数据类型（如 `undefined`、`NaN`、`Infinity`）的处理方式：

  - `undefined` 会被忽略，或转换为 `null`。
  - `NaN` 和 `Infinity` 会被转换为 `null`。

##### 示例：

```js
const obj = { key1: undefined, key2: NaN, key3: Infinity };
const jsonString = JSON.stringify(obj);
console.log(jsonString); // '{"key2":null,"key3":null}'
```

### 3. **`JSON.parse()` 和 `JSON.stringify()` 的常见组合用法**

#### 3.1 深拷贝对象

- 使用 `JSON.parse()` 和 `JSON.stringify()` 可以实现对象的深拷贝。

```js
const original = { name: "John", address: { city: "New York" } };
const copy = JSON.parse(JSON.stringify(original));

copy.address.city = "Los Angeles"; // 修改拷贝对象
console.log(original.address.city); // "New York"
console.log(copy.address.city); // "Los Angeles"
```

#### 3.2 处理后端返回的 JSON 数据

- 从后端获取 JSON 数据后，可以使用 `JSON.parse()` 解析它。
- 向后端发送 JSON 数据时，使用 `JSON.stringify()`。

```js
// 假设从后端获取到 JSON 数据：
const jsonString = '{"status":"ok","data":{"name":"John"}}';
const jsonObj = JSON.parse(jsonString); // 解析数据
console.log(jsonObj.data.name); // "John"

// 向后端发送 JSON 数据：
const data = { name: "John", age: 30 };
const jsonStringToSend = JSON.stringify(data);
console.log(jsonStringToSend); // '{"name":"John","age":30}'
```

### 总结

- **`JSON.parse()`**: 用于将 JSON 字符串转换为 JavaScript 对象，可以通过 `reviver` 函数控制数据的转换过程。
- **`JSON.stringify()`**: 用于将 JavaScript 对象转换为 JSON 字符串，可以通过 `replacer` 过滤数据，使用 `space` 参数进行格式化输出。
- 这两个方法在前后端通信、存储数据等场景中有着广泛的应用，掌握它们可以帮助你更高效地处理 JSON 数据。
