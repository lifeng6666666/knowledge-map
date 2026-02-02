# 知识地图项目完成指南

## ✅ 项目已完成

你现在有一个完整的、可部署的知识地图应用！

## 📦 项目内容

### 核心文件
- **index.html** - 美观的用户界面，包含 vis.js 网状图
- **app.js** - 完整的应用逻辑，支持节点编辑、关系管理、数据导入导出
- **sample-data.json** - 包含经济学、计算机科学、数学的示例数据

### 文档
- **README.md** - 项目说明和功能介绍
- **QUICKSTART.md** - 5分钟快速开始指南 ⭐ **从这里开始！**
- **DEPLOY.md** - GitHub Pages 部署步骤
- **ADVANCED.md** - 高级自定义功能

### 配置
- **.gitignore** - Git 配置文件

---

## 🚀 立即开始

### 第一步：本地测试（2分钟）
```bash
# 方式1：直接打开（最简单）
double-click index.html

# 方式2：本地服务器
python -m http.server 8000
# 访问 http://localhost:8000
```

### 第二步：导入示例数据（1分钟）
1. 点击左侧 "**数据**" 标签
2. 点击 "**⬆️ 导入 JSON**"
3. 打开 `sample-data.json`，复制全部内容
4. 粘贴到对话框，点击 "**导入**"

现在你能看到：
- 📚 经济学学科（微观、宏观、计量）
- 💻 计算机科学（编程、算法、系统、数据库）
- 🧮 数学基础（微积分、线性代数、概率统计）

### 第三步：部署到 GitHub（5分钟）
详见 **QUICKSTART.md** 的"部署到 GitHub Pages"部分

---

## 🎯 主要特性

### ✨ 节点编辑
- ✅ 添加课程和概念节点
- ✅ 编辑节点信息（名称、描述、教科书、推荐课程）
- ✅ 删除节点（自动删除相关关系）
- ✅ 节点详情实时展示

### 🔗 关系管理
- ✅ 4种关系类型：
  - 🔴 前置课程（红色）
  - 🟢 后继课程（绿色）
  - 💚 相关课程（浅绿）
  - 💛 应用（黄色）
- ✅ 灵活的关系编辑

### 💾 数据管理
- ✅ 自动保存到浏览器本地存储
- ✅ JSON 导入/导出
- ✅ 下载为 JSON 文件
- ✅ 支持数据备份和恢复

### 🌐 可视化
- ✅ 动态网状图（vis.js）
- ✅ 物理引擎自动布局
- ✅ 交互式拖拽、缩放
- ✅ 节点悬停提示信息

### 🎨 用户界面
- ✅ 响应式设计
- ✅ 标签页整理（编辑、详情、数据）
- ✅ 清晰的视觉反馈
- ✅ 状态消息提示

---

## 📊 数据结构

应用使用简洁的 JSON 格式：

```json
{
  "nodes": [
    {
      "id": "node_1",
      "label": "课程名",
      "type": "course",           // "course" 或 "concept"
      "description": "描述",
      "books": "教科书1\n教科书2",
      "courses": "课程1\n课程2"
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "from": "node_1",
      "to": "node_2",
      "label": "前置",
      "type": "prerequisite"      // prerequisite, follow, related, applied
    }
  ]
}
```

---

## 🔧 自定义建议

### 快速自定义
1. **改变颜色**：编辑 `app.js` 中的 `color` 对象
2. **添加关系类型**：修改 `labelMap` 和 `colorMap`
3. **调整布局**：修改 `physics` 参数

### 高级功能
参见 **ADVANCED.md**：
- 预设数据集
- 导出为 SVG/PNG/DOT 格式
- 路径查找算法
- 数据统计分析
- 搜索功能

---

## 📋 部署清单

### GitHub Pages 部署（推荐）
- [ ] 创建 GitHub 账户（如需）
- [ ] 创建 `knowledge-map` 仓库
- [ ] 推送代码到 `main` 分支
- [ ] 启用 GitHub Pages（Settings → Pages）
- [ ] 验证网站 URL
- [ ] 分享链接

### 其他部署选项
- [ ] Netlify（免费，自动构建）
- [ ] Vercel（免费，极速）
- [ ] GitLab Pages（类似 GitHub Pages）
- [ ] 自己的服务器

---

## 💡 使用场景

### 个人学习规划
📚 规划自己的学习路径，清晰看到课程前置关系

### 课程推荐系统
👥 创建学科的完整体系，推荐给学生

### 知识体系整理
🧠 整理行业、公司或团队的知识图谱

### 教学资源管理
👨‍🏫 帮助教师展示课程体系和关联

### 考试准备
📖 规划考试复习顺序和学习资源

---

## 🌟 下一步计划

### 当前版本功能完成度：100% ✅

### 可选扩展功能（将来）
- 用户认证和多人协作
- 云存储数据同步
- 学习进度跟踪
- 交互式学习路径
- 与外部资源集成（Udemy、Coursera、YouTube）
- 社区分享和评分
- 移动应用版本

### 贡献欢迎！
如果你想添加功能，欢迎 Fork 并提交 Pull Request。

---

## 📖 文档导航

| 文档 | 目的 | 阅读时间 |
|------|------|--------|
| **QUICKSTART.md** | 5分钟快速入门 | 5 min |
| **README.md** | 功能详细说明 | 10 min |
| **DEPLOY.md** | GitHub 部署指南 | 5 min |
| **ADVANCED.md** | 高级自定义 | 20 min |

---

## 🎓 学习资源

### vis.js 网络图库
- 官方文档：https://visjs.org/
- 示例：https://visjs.github.io/vis-network/examples/

### GitHub Pages
- 官方文档：https://pages.github.com/
- 快速开始：https://docs.github.com/en/pages

### JSON 格式
- 在线验证：https://jsonlint.com/
- 教程：https://www.json.org/

---

## 📞 技术支持

### 常见问题
查看 **QUICKSTART.md** 的常见问题部分

### GitHub Issues
在项目仓库中开 Issue 报告 bug 或建议功能

### 自助调试
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签中的错误信息
3. 检查 Network 标签中的请求

---

## ⚖️ 许可证

MIT License - 自由使用、修改和分享

---

## 🎉 恭喜！

你现在拥有：
- ✅ 一个功能完整的知识地图应用
- ✅ 可以部署到 GitHub Pages 的代码
- ✅ 完整的文档和示例
- ✅ 清晰的自定义指南

**现在就开始创建你的知识地图吧！** 🚀

有任何问题或建议，欢迎反馈！

---

**最后更新**：2026年2月
**版本**：1.0.0
