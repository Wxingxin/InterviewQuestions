好，直接上干货：**40 个在真实项目里经常用到的 useEffect 模板**。
你可以当作 *“复制就能用的代码词典”* 来查。

我会按场景分组，每个例子都尽量短，只保留最关键部分。

---

## 一、数据请求 / 请求相关（1–10）

### 1️⃣ 组件挂载时请求用户信息

```jsx
useEffect(() => {
  async function loadUser() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setUser(data);
  }
  loadUser();
}, []);
```

---

### 2️⃣ 根据 id 请求详情（依赖变化）

```jsx
useEffect(() => {
  if (!id) return;
  async function fetchDetail() {
    const res = await fetch(`/api/post/${id}`);
    setPost(await res.json());
  }
  fetchDetail();
}, [id]);
```

---

### 3️⃣ 搜索框防抖请求（输入停止 500ms 再查）

```jsx
useEffect(() => {
  if (!keyword) return;
  const timer = setTimeout(() => {
    fetch(`/api/search?q=${keyword}`).then(r => r.json()).then(setResult);
  }, 500);
  return () => clearTimeout(timer);
}, [keyword]);
```

---

### 4️⃣ 用户切换时重新拉取数据

```jsx
useEffect(() => {
  if (!userId) return;
  fetch(`/api/dashboard?user=${userId}`)
    .then(res => res.json())
    .then(setDashboard);
}, [userId]);
```

---

### 5️⃣ 分页请求（页码变化触发）

```jsx
useEffect(() => {
  fetch(`/api/list?page=${page}&size=${pageSize}`)
    .then(res => res.json())
    .then(setList);
}, [page, pageSize]);
```

---

### 6️⃣ 请求过程 loading + error 状态

```jsx
useEffect(() => {
  let ignore = false;
  setLoading(true);
  fetch("/api/products")
    .then(r => r.json())
    .then(data => !ignore && setData(data))
    .catch(e => !ignore && setError(e))
    .finally(() => !ignore && setLoading(false));
  return () => { ignore = true; };
}, []);
```

---

### 7️⃣ 通过 AbortController 取消请求（组件卸载时）

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/list", { signal: controller.signal }).then(r => r.json()).then(setList);
  return () => controller.abort();
}, []);
```

---

### 8️⃣ 滚动到底部自动加载更多（简化版）

```jsx
useEffect(() => {
  function onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
      loadMore(); // 你写好的加载更多函数
    }
  }
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, [loadMore]);
```

---

### 9️⃣ 数据变化自动同步到 localStorage

```jsx
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

---

### 🔟 初始化时从 localStorage 恢复数据

```jsx
useEffect(() => {
  const str = localStorage.getItem("cart");
  if (str) setCart(JSON.parse(str));
}, []);
```

---

## 二、事件监听 / 订阅（11–18）

### 1️⃣1️⃣ 监听窗口大小变化（响应式布局）

```jsx
useEffect(() => {
  function onResize() {
    setWidth(window.innerWidth);
  }
  window.addEventListener("resize", onResize);
  onResize();
  return () => window.removeEventListener("resize", onResize);
}, []);
```

---

### 1️⃣2️⃣ 监听键盘按键（Esc 关闭弹框）

```jsx
useEffect(() => {
  function onKeyDown(e) {
    if (e.key === "Escape") onClose();
  }
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [onClose]);
```

---

### 1️⃣3️⃣ 监听页面滚动回到顶部按钮显示

```jsx
useEffect(() => {
  function onScroll() {
    setShowBackTop(window.scrollY > 400);
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

---

### 1️⃣4️⃣ 订阅 WebSocket 消息

```jsx
useEffect(() => {
  const socket = new WebSocket("wss://example.com/chat");
  socket.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    setMessages(prev => [...prev, msg]);
  };
  return () => socket.close();
}, []);
```

---

### 1️⃣5️⃣ 订阅自定义事件（如 EventEmitter）

```jsx
useEffect(() => {
  function onChange(payload) {
    setValue(payload);
  }
  emitter.on("change", onChange);
  return () => emitter.off("change", onChange);
}, []);
```

---

### 1️⃣6️⃣ 监听页面可见性变化（用户切出页面暂停轮询）

```jsx
useEffect(() => {
  function onVisibilityChange() {
    setVisible(document.visibilityState === "visible");
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  onVisibilityChange();
  return () => document.removeEventListener("visibilitychange", onVisibilityChange);
}, []);
```

---

### 1️⃣7️⃣ 拖拽事件监听（简单版）

```jsx
useEffect(() => {
  if (!dragging) return;
  function onMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
  window.addEventListener("mousemove", onMove);
  return () => window.removeEventListener("mousemove", onMove);
}, [dragging]);
```

---

### 1️⃣8️⃣ 监听网络状态（online/offline）

```jsx
useEffect(() => {
  function update() {
    setOnline(navigator.onLine);
  }
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
  return () => {
    window.removeEventListener("online", update);
    window.removeEventListener("offline", update);
  };
}, []);
```

---

## 三、计时器 / 动画 / 节奏控制（19–25）

### 1️⃣9️⃣ 倒计时

```jsx
useEffect(() => {
  if (count <= 0) return;
  const timer = setInterval(() => {
    setCount(c => c - 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]);
```

---

### 2️⃣0️⃣ 自动轮播图

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setIndex(i => (i + 1) % banners.length);
  }, 3000);
  return () => clearInterval(timer);
}, [banners.length]);
```

---

### 2️⃣1️⃣ 用户一段时间无操作自动退出登录

```jsx
useEffect(() => {
  let timer;
  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(logout, 10 * 60 * 1000); // 10 分钟
  }
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  resetTimer();
  return () => {
    clearTimeout(timer);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
  };
}, [logout]);
```

---

### 2️⃣2️⃣ 输入停止 1 秒后自动保存草稿

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    saveDraft(content);
  }, 1000);
  return () => clearTimeout(timer);
}, [content, saveDraft]);
```

---

### 2️⃣3️⃣ loading 动画结束后自动隐藏

```jsx
useEffect(() => {
  if (!loading) return;
  const timer = setTimeout(() => setLoading(false), 3000);
  return () => clearTimeout(timer);
}, [loading]);
```

---

### 2️⃣4️⃣ 按频率节流地触发某个函数（比如 resize）

```jsx
useEffect(() => {
  let ticking = false;
  function onResize() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateLayout();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, [updateLayout]);
```

---

### 2️⃣5️⃣ 进入页面后延迟显示引导弹窗

```jsx
useEffect(() => {
  const timer = setTimeout(() => setShowGuide(true), 2000);
  return () => clearTimeout(timer);
}, []);
```

---

## 四、DOM 操作 / UI 行为（26–32）

### 2️⃣6️⃣ 组件挂载后自动聚焦输入框

```jsx
useEffect(() => {
  inputRef.current?.focus();
}, []);
```

---

### 2️⃣7️⃣ 根据条件滚动到指定元素

```jsx
useEffect(() => {
  if (!activeId) return;
  const el = document.getElementById(activeId);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}, [activeId]);
```

---

### 2️⃣8️⃣ 监听点击事件实现“点击外面关闭弹框”

```jsx
useEffect(() => {
  function handleClickOutside(e) {
    if (ref.current && !ref.current.contains(e.target)) {
      onClose();
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [onClose]);
```

---

### 2️⃣9️⃣ 根据主题切换添加 body 的 class

```jsx
useEffect(() => {
  document.body.classList.toggle("dark", theme === "dark");
}, [theme]);
```

---

### 3️⃣0️⃣ 页面标题动态显示未读数

```jsx
useEffect(() => {
  if (!unreadCount) {
    document.title = "我的应用";
  } else {
    document.title = `(${unreadCount}) 我的应用`;
  }
}, [unreadCount]);
```

---

### 3️⃣1️⃣ 根据状态禁用滚动（比如打开全屏弹窗）

```jsx
useEffect(() => {
  if (modalOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => { document.body.style.overflow = ""; };
}, [modalOpen]);
```

---

### 3️⃣2️⃣ 进入页面自动滚动到顶部

```jsx
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
```

---

## 五、业务逻辑 / 权限 / 表单（33–40）

### 3️⃣3️⃣ 登录状态变化时，刷新用户权限

```jsx
useEffect(() => {
  if (!token) {
    setPermissions([]);
    return;
  }
  fetch("/api/permissions", { headers: { Authorization: token } })
    .then(r => r.json())
    .then(setPermissions);
}, [token]);
```

---

### 3️⃣4️⃣ 表单值变化时做实时校验

```jsx
useEffect(() => {
  const errors = {};
  if (!form.email.includes("@")) errors.email = "邮箱格式不正确";
  if (form.password.length < 6) errors.password = "至少 6 位";
  setErrors(errors);
}, [form]);
```

---

### 3️⃣5️⃣ 购物车变化时更新价格合计

```jsx
useEffect(() => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  setTotal(total);
}, [cart]);
```

---

### 3️⃣6️⃣ 监听路由变化上报 PV（比如在 SPA）

```jsx
useEffect(() => {
  trackPageView(location.pathname);
}, [location.pathname]);
```

---

### 3️⃣7️⃣ 设备类型变化时选择不同布局（响应式）

```jsx
useEffect(() => {
  setLayout(width < 768 ? "mobile" : "desktop");
}, [width]);
```

---

### 3️⃣8️⃣ 多语言切换时更新 i18n 配置

```jsx
useEffect(() => {
  i18n.changeLanguage(locale);
}, [locale]);
```

---

### 3️⃣9️⃣ 当前 tab 切换时自动刷新该 tab 的数据

```jsx
useEffect(() => {
  fetch(`/api/tabData?tab=${activeTab}`)
    .then(r => r.json())
    .then(setTabData);
}, [activeTab]);
```

---

### 4️⃣0️⃣ 用户点击“保存设置”后，短暂提示“已保存”

```jsx
useEffect(() => {
  if (!saveSuccess) return;
  const timer = setTimeout(() => setSaveSuccess(false), 1500);
  return () => clearTimeout(timer);
}, [saveSuccess]);
```

---

## 总结一下使用感觉（帮你形成直觉）

你可以把 `useEffect` 想象成：

> **“当 X 发生时（依赖变化），帮我做 Y（副作用）”**

比如：

* 当组件挂载时 → 去请求一次用户信息
* 当 keyword 变化时 → 等 500ms 去搜索
* 当 modalOpen 变 true 时 → 禁用页面滚动
* 当 unreadCount 变时 → 改 document.title

---

如果你愿意，下一步我可以帮你：

* 把这些例子**整理成一个小 demo 项目结构**
* 或者按你现在正在做的项目，帮你设计用 useEffect 的最佳写法
* 或者继续讲 **useMemo / useCallback 使用大全 + 和 useEffect 的区别**

你现在是在做什么类型的项目？后台管理？博客？商城？我可以针对你的项目挑几类例子展开讲一遍。
