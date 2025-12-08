下面为你整理 **列表样式（List Styling）** 和 **表格样式（Table Styling）** 的完整属性说明、取值、效果与示例，结构清晰方便快速查阅👇

---

# 📝 **列表样式（List Styling）**

## 1. `list-style-type`

设置列表项前的标记类型（项目符号、编号等）。

### **常用取值：**

**无序列表：**

* `disc`（默认 ●）
* `circle`（○）
* `square`（■）
* `none`（无符号）

**有序列表：**

* `decimal`（1,2,3）
* `decimal-leading-zero`（01,02,03）
* `lower-alpha`（a,b,c）
* `upper-alpha`（A,B,C）
* `lower-roman`（i, ii, iii）
* `upper-roman`（I, II, III）

### **示例：**

```css
list-style-type: square;
```

---

## 2. `list-style-image`

使用图像作为列表项标记。

### **示例：**

```css
list-style-image: url("icon.png");
```

⚠️ 图片太大时无法自动缩放，较少使用。

---

## 3. `list-style-position`

控制项目符号的位置。

### **取值：**

| 值             | 说明                |
| ------------- | ----------------- |
| `outside`（默认） | 符号在文本外；文本换行会与左侧对齐 |
| `inside`      | 符号在文本内部；换行文本会缩进   |

### 示例：

```css
list-style-position: inside;
```

---

## 4. `list-style`（简写）

将 list-style 的三个子属性合并：

```
list-style: type image position;
```

### 示例：

```css
list-style: square url(icon.png) inside;
```

也可以只写部分，例如：

```css
list-style: none;
```

---

# 📊 **表格样式（Table Styling）**

## 1. `border-collapse`

设置单元格边框是否合并。

### **取值：**

| 值              | 说明                         |
| -------------- | -------------------------- |
| `collapse`     | 边框合并（常用于简洁表格）              |
| `separate`（默认） | 边框独立，允许设置 `border-spacing` |

### 示例：

```css
table {
  border-collapse: collapse;
}
```

---

## 2. `border-spacing`

设置单元格之间的间距（仅在 `separate` 模式下有效）。

### **示例：**

```css
table {
  border-spacing: 10px 20px; /* 水平 10px，垂直 20px */
}
```

---

## 3. `caption-side`

设置表格标题（`<caption>`）的位置。

### **取值：**

| 值         | 说明   |
| --------- | ---- |
| `top`（默认） | 表格上方 |
| `bottom`  | 表格下方 |

### 示例：

```css
caption-side: bottom;
```

---

## 4. `empty-cells`

控制是否显示空单元格的边框或背景（仅 `separate` 有效）。

### **取值：**

| 值          | 说明         |
| ---------- | ---------- |
| `show`（默认） | 显示空单元格     |
| `hide`     | 隐藏空单元格边框背景 |

### 示例：

```css
empty-cells: hide;
```

---

## 5. `table-layout`

控制表格宽度布局方式。

### **取值：**

| 值          | 说明                     |
| ---------- | ---------------------- |
| `auto`（默认） | 根据单元格内容自动调整宽度          |
| `fixed`    | 固定布局，更快渲染，通常配合 `width` |

### 示例：

```css
table {
  table-layout: fixed;
  width: 100%;
}
```

**效果：**

* 列宽按表格总宽度 + 第一行宽度来分配
* 内容溢出时会换行或隐藏

---

# 📌 如需 Demo 示例我可以写一个

我可以提供一个包含所有列表和表格属性的 **完整 HTML + CSS 示例**，也可以做成对照效果图。如果你想要可视化示例，告诉我即可。
