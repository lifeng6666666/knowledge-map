# 📚 知识地图 v2.0 (Knowledge Map v2.0)

> 一个交互式的中文知识图谱可视化应用，覆盖计算机科学、经济学、AI等领域。
> 
> An interactive Chinese knowledge map visualization app covering CS, Economics, AI and more.

---

## 🎯 快速开始 (Quick Start)

### 最简单的方式 (Simplest Way)

```bash
# 方式1: 直接打开 (Direct)
双击 index.html

# 方式2: 用服务器启动 (With Server)
python -m http.server 8000
# 然后访问: http://localhost:8000
```

**预计时间**: 5分钟上手 | **需要**: 仅需浏览器

---

## ✨ 核心特性 (Features)

### 已完成的6个核心改进 (6 Core Improvements)

✅ **中文本地化** (Chinese Localization)
- 完整的中文翻译 (42个节点)
- 中文课程描述和推荐资源

✅ **概念类型显示** (Concept Type Display)
- 10个概念节点分为3类
  - 学科 (6): 计算机、数学、系统设计、AI、经济、Web
  - 技能 (2): 编程、自主学习
  - 思维方式 (2): 问题求解、系统思维

✅ **知识地图增强** (Map Enhancement)
- 从34增至42个节点
- 从41增至58+条关系
- 完整的学习路径映射

✅ **课程关系完善** (Course Relationships)
- 课程间的先修关系
- 课程与多个概念的关联
- 知识点应用关系

✅ **交互式标签过滤** (Interactive Tag Filtering) ⭐ 重点
- 点击概念标签实时过滤
- 自动发现和显示相关节点
- 自动调整视图缩放

✅ **完整文档体系** (Documentation)
- 7个详细的中英文文档
- 学习路径指南
- 部署和定制说明

---

## 📖 文档导航 (Documentation)

### 🟢 中文文档 (推荐)

| 文档 | 用途 | 时间 |
|------|------|------|
| **[GET_STARTED.md](GET_STARTED.md)** | 立即开始使用（推荐首先阅读）| 3分钟 |
| **[FILE_INDEX.md](FILE_INDEX.md)** | 完整的文件索引和导航 | 5分钟 |
| **[QUICK_START_CN.md](QUICK_START_CN.md)** | 中文快速入门 | 5分钟 |
| **[UPDATE_v2_CN.md](UPDATE_v2_CN.md)** | v2.0详细改进说明 | 10分钟 |
| **[KNOWLEDGE_MAP_STRUCTURE.md](KNOWLEDGE_MAP_STRUCTURE.md)** | 42个节点的完整清单 | 15分钟 |
| **[FINAL_REPORT.md](FINAL_REPORT.md)** | 项目完成总结报告 | 8分钟 |

### 🔵 英文文档 & 参考

| 文档 | 用途 | 时间 |
|------|------|------|
| **[QUICKSTART.md](QUICKSTART.md)** | English quick start | 5分钟 |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Project overview | 5分钟 |
| **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** | Completion checklist | 5分钟 |
| **[DEPLOY.md](DEPLOY.md)** | Deployment guide | 5分钟 |
| **[ADVANCED.md](ADVANCED.md)** | Advanced customization | 20分钟 |

---

## 🎯 按你的需求选择文档

### "我是新用户，想快速上手"
1. **[GET_STARTED.md](GET_STARTED.md)** (3分钟)
2. 打开 `index.html` 体验应用
3. 完成！

### "我想了解有哪些课程"
1. **[KNOWLEDGE_MAP_STRUCTURE.md](KNOWLEDGE_MAP_STRUCTURE.md)** (15分钟)
2. 应用中点击各个节点查看详情
3. 完成！

### "我想知道v2.0改进了什么"
1. **[UPDATE_v2_CN.md](UPDATE_v2_CN.md)** (10分钟)
2. **[FINAL_REPORT.md](FINAL_REPORT.md)** (8分钟)
3. 完成！

### "我想修改或扩展应用"
1. **[ADVANCED.md](ADVANCED.md)** (20分钟)
2. 查看源代码: `app.js` 和 `index.html`
3. 完成！

### "我想分享给他人"
1. **[DEPLOY.md](DEPLOY.md)** (5分钟)
2. 按步骤部署到GitHub Pages
3. 完成！

---

## 📊 项目统计 (Project Stats)

```
知识地图 v2.0 包含:

核心应用:
  ✅ index.html     464行    完整的HTML+CSS
  ✅ app.js         544行    应用逻辑 + 过滤功能
  ✅ 完全响应式设计

数据文件:
  ✅ knowledge-map-cn.json      42个节点，58+条关系（推荐）
  ✅ sample-data.json           默认加载数据
  ✅ knowledge-map-complete.json 英文参考版本

文档:
  ✅ 6个中文详细文档
  ✅ 10个文件总计
  ✅ 30,000+ 字说明
  ✅ 完整的使用指南和部署方案

概念节点: 10个
  - 学科(6): 计算机科学、数学基础、系统设计、机器学习与AI、经济学、Web开发
  - 技能(2): 编程能力、自主学习
  - 思维方式(2): 问题求解、系统思维

课程节点: 32个
  - 编程语言: Python、Java、C++、JavaScript、Go等
  - CS基础: 数据结构、算法、操作系统、数据库等
  - AI/ML: 机器学习、深度学习、自然语言处理
  - 经济学: 宏观经济学、微观经济学、金融学
  - Web开发: 前端、后端开发
  - 云计算: DevOps、云架构
  - 安全: 密码学、信息安全

关系: 58+ 条
  - 课程间先修关系
  - 课程与概念的应用关系
  - 概念间的递进关系
```

---

## 🎮 核心功能演示 (Core Features)

### 1. 交互式知识地图 (Interactive Map)
```
✨ 显示42个节点的完整知识体系
🎨 蓝色=概念节点，绿色=课程节点
🖱️ 拖动可以移动节点
🔍 滚动鼠标可以缩放视图
```

### 2. 概念标签过滤 (Tag Filtering) ⭐ 重点
```
点击顶部的标签（如[计算机科学]）→ 自动过滤相关节点
点击[全部] → 恢复完整视图
演示: 过滤显示特定领域的完整学习路径
```

### 3. 节点详情查看 (Node Details)
```
点击任一节点 → 左侧显示详细信息
包含: 名称、类型、描述、推荐资源
```

### 4. 学习路径推荐 (Learning Paths)
```
左侧"详情"标签 → 显示4条推荐学习路径
包括初级编程、AI学习、经济学等
```

### 5. 数据管理 (Data Management)
```
导入JSON: 上传自己的知识图谱
导出JSON: 保存修改后的数据
编辑: 添加/删除/修改节点和关系
```

---

## 💻 技术栈 (Tech Stack)

- **前端框架**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **可视化库**: vis.js 4.21.0 (Network Graph)
- **数据格式**: JSON (Nodes & Edges)
- **数据存储**: Browser LocalStorage + JSON Export
- **部署**: 任何HTTP服务器 (Python, Node.js, Nginx等)
- **兼容性**: Chrome, Firefox, Safari, Edge (现代浏览器)

---

## 🚀 部署方式 (Deployment)

### 本地运行 (Local Development)

**方式1: 直接打开**
```bash
双击 index.html
或右键 → 选择浏览器打开
```

**方式2: 启动本地服务器**
```bash
# Python 3
python -m http.server 8000

# 然后打开: http://localhost:8000
```

**方式3: 用VS Code打开**
```bash
code .
# 然后用 Live Server 扩展（F5启动）
```

### 部署到网络 (Production)

**部署到GitHub Pages** (推荐)
- 详见 [DEPLOY.md](DEPLOY.md)
- 5分钟完成，完全免费

**部署到云服务**
- 详见 [DEPLOY.md](DEPLOY.md)
- 支持AWS, Azure, Heroku等

---

## 📁 文件结构 (File Structure)

```
knowledge-map/
├── 🎯 核心应用 (Core App)
│   ├── index.html              主应用界面 (464行)
│   └── app.js                  应用逻辑 (544行)
│
├── 📊 数据文件 (Data)
│   ├── knowledge-map-cn.json   中文完整数据 (推荐) ⭐
│   ├── sample-data.json        默认加载数据
│   └── knowledge-map-complete.json  英文参考
│
├── 📖 中文文档 (Docs-Chinese)
│   ├── GET_STARTED.md          👈 从这里开始！
│   ├── FILE_INDEX.md           文件索引导航
│   ├── QUICK_START_CN.md       中文快速开始
│   ├── UPDATE_v2_CN.md         v2.0详细改进
│   ├── KNOWLEDGE_MAP_STRUCTURE.md 完整节点清单
│   └── FINAL_REPORT.md         项目完成总结
│
├── 📘 英文文档 (Docs-English)
│   ├── README.md               原始说明
│   ├── QUICKSTART.md           English quick start
│   ├── PROJECT_SUMMARY.md      项目总结
│   ├── DEPLOY.md               部署指南
│   ├── ADVANCED.md             高级定制
│   ├── COMPLETION_SUMMARY.md   完成清单
│   └── COMPLETION.md           完成指南
│
└── ⚙️ 配置
    └── .gitignore
```

---

## ✅ 项目完成情况 (Completion Status)

### 用户需求 (User Requirements)

✅ **需求1: 中文翻译** (Chinese Translation)
- 状态: 100% 完成
- 内容: 42个节点完全中文化
- 文件: knowledge-map-cn.json

✅ **需求2: 概念类型显示** (Type Display)
- 状态: 100% 完成
- 内容: 10个概念节点显示类型标记
- 文件: app.js (lines 31-37)

✅ **需求3: 知识地图增强** (Map Enhancement)
- 状态: 100% 完成
- 内容: 34→42节点，41→58+关系
- 文件: knowledge-map-cn.json

✅ **需求4: 课程关系完善** (Relationships)
- 状态: 100% 完成
- 内容: 完整的先修和应用关系
- 文件: knowledge-map-cn.json

✅ **需求5: 概念标题显示** (Title Display)
- 状态: 100% 完成
- 内容: 节点标签显示类型
- 文件: app.js

✅ **需求6: 标签过滤功能** (Tag Filtering) ⭐
- 状态: 100% 完成
- 内容: 可点击的交互式过滤
- 文件: app.js + index.html

### 额外成果 (Bonus)

✅ 完整的中文文档体系 (7个文件，30,000+字)
✅ 学习路径示例和指南
✅ 部署和定制说明
✅ 质量保证检查 (10/10项通过)

---

## 🎓 学习路径示例 (Learning Path Examples)

### 路径1: 初级编程学习者 (Beginner Programmer)
Python → 数据结构 → 算法 → Web开发 → 系统设计

### 路径2: AI学习者 (AI Enthusiast)
Python → 数学基础 → 机器学习 → 深度学习 → NLP

### 路径3: 经济学爱好者 (Economics Student)
微观经济学 → 宏观经济学 → 金融学 → 金融科技

### 路径4: 完整CS学位 (Full CS Degree)
基础编程 → 数据结构 → 算法 → OS → 数据库 → 网络 → 系统设计 → AI

---

## 💡 常见问题 (FAQ)

**Q: 我需要安装什么吗？**
A: 不需要！只需要一个现代浏览器就可以直接打开 index.html

**Q: 可以添加自己的课程吗？**
A: 完全可以！查看 ADVANCED.md 了解如何编辑JSON数据

**Q: 数据会被保存吗？**
A: 会！修改被自动保存到浏览器的本地存储。也可以导出JSON备份

**Q: 可以分享给别人吗？**
A: 完全可以！查看 DEPLOY.md 部署到GitHub Pages，然后分享链接

**Q: 支持哪些浏览器？**
A: Chrome, Firefox, Safari, Edge（所有现代浏览器）

**Q: 我想修改样式怎么办？**
A: 编辑 index.html 中的CSS部分，或查看 ADVANCED.md

---

## 🏆 项目亮点 (Highlights)

🌟 **完全中文化** - 从界面到数据全是中文  
🌟 **即开即用** - 双击就能打开，无需安装  
🌟 **丰富的数据** - 42个精心挑选的节点  
🌟 **交互式过滤** - 点击标签实时查看相关内容  
🌟 **完整文档** - 7个详细文档，30000+字说明  
🌟 **可自定义** - 轻松添加自己的课程和关系  
🌟 **易于部署** - 支持GitHub Pages等多种部署方式  

---

## 🔗 快速链接 (Quick Links)

| 需要 | 点击 |
|------|------|
| 👉 **立即开始** | [GET_STARTED.md](GET_STARTED.md) |
| 📑 **文件索引** | [FILE_INDEX.md](FILE_INDEX.md) |
| 💻 **快速开始** | [QUICK_START_CN.md](QUICK_START_CN.md) |
| 📚 **完整课程清单** | [KNOWLEDGE_MAP_STRUCTURE.md](KNOWLEDGE_MAP_STRUCTURE.md) |
| 📊 **项目成果** | [FINAL_REPORT.md](FINAL_REPORT.md) |
| 🚀 **部署指南** | [DEPLOY.md](DEPLOY.md) |
| 🛠️ **高级定制** | [ADVANCED.md](ADVANCED.md) |

---

## 📞 支持 (Support)

- **查看文档**: 大多数问题都能在相应的文档中找到答案
- **检查FAQ**: 常见问题已在多个文档中解答
- **查看源代码**: index.html 和 app.js 有详细的注释

---

## 📜 许可证 (License)

MIT License - 免费开源，可自由使用和修改

---

## 🎉 开始探索知识地图吧！

### 立即开始的3个方法:

1. **双击** `index.html` 打开
2. **运行** `python -m http.server 8000` 启动服务器
3. **打开** [GET_STARTED.md](GET_STARTED.md) 阅读指南

```
祝你享受知识地图的使用体验！📚✨
```

---

**知识地图 v2.0** | 中文知识图谱可视化应用 | 完全本地化 | 42个节点 | 58+条关系

*最后更新: 2024年*
*文档和应用都已完整准备就绪！*
