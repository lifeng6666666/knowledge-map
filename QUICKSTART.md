# 快速开始指南

## 5分钟快速开始

### 1️⃣ 本地运行（推荐用于测试）

**方式 A：直接打开文件**
- 双击 `index.html` 即可在浏览器中打开

**方式 B：使用 Python 本地服务器**
```bash
# Python 3
python -m http.server 8000

# 然后访问 http://localhost:8000
```

**方式 C：使用 Node.js http-server**
```bash
npm install -g http-server
http-server
```

### 2️⃣ 导入示例数据

1. 打开应用后，点击左侧 "**数据**" 标签页
2. 点击 "**⬆️ 导入 JSON**"
3. 打开 `sample-data.json` 文件，复制全部内容
4. 粘贴到导入框中
5. 点击 "**导入**" 按钮

现在你能看到一个完整的知识地图示例，包含：
- 经济学学科体系
- 计算机科学体系
- 数学基础

### 3️⃣ 尝试编辑

在 "**编辑**" 标签页中：
1. 选择节点类型（📖 课程 或 🎯 概念）
2. 输入课程名称
3. 填写描述、教科书和推荐课程（可选）
4. 点击 "✨ 添加节点"

然后添加关系：
1. 选择 "从节点" 和 "到节点"
2. 选择关系类型
3. 点击 "🔗 添加关系"

### 4️⃣ 部署到 GitHub Pages

#### 步骤 1：创建 GitHub 账户
如果还没有，访问 https://github.com/signup

#### 步骤 2：创建新仓库
1. 访问 https://github.com/new
2. 仓库名输入：`knowledge-map`
3. 描述：`Visual knowledge map for learning pathways`
4. 选择 **Public**
5. 点击 **Create repository**

#### 步骤 3：推送代码
```bash
# 在项目目录打开 Git Bash 或 PowerShell
cd knowledge-map

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/knowledge-map.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

#### 步骤 4：启用 GitHub Pages
1. 访问 https://github.com/YOUR_USERNAME/knowledge-map
2. 点击 **Settings**（右上角）
3. 左侧菜单选择 **Pages**
4. **Source** 选择：Branch: `main` / Folder: `/ (root)`
5. 点击 **Save**

#### 步骤 5：完成！
等待 1-2 分钟后，访问：
```
https://YOUR_USERNAME.github.io/knowledge-map/
```

### 5️⃣ 更新内容

每次修改后，在项目目录运行：
```bash
git add .
git commit -m "更新知识地图"
git push
```

GitHub 会自动部署，1-2 分钟后生效。

---

## 常见问题

### Q：我不懂 Git，有其他方法吗？

**是的！使用 GitHub Web 界面：**
1. 创建仓库后，点击 **Add file** → **Upload files**
2. 选择本地文件上传
3. 在 Settings → Pages 中启用
4. 完成！

之后要更新时，直接在 web 界面编辑文件或重新上传。

### Q：如何备份我的数据？

点击 "数据" 标签页，点击 "⬇️ 导出 JSON"，保存文件。定期备份防止意外丢失。

### Q：能和他人协作吗？

**方式 1：共享 JSON 文件**
- 导出 JSON
- 发给他人
- 他人通过导入功能加载

**方式 2：GitHub 协作**
- 在 GitHub 仓库 Settings → Collaborators 添加成员
- 成员可以直接编辑和推送

### Q：手机上能用吗？

可以！访问 `https://yourusername.github.io/knowledge-map/` 即可。
但编辑体验更好的是在电脑上。

### Q：能导出为 PDF 或图片吗？

可以使用浏览器的打印功能（Ctrl+P）保存为 PDF，或用截图工具。

### Q：节点位置不对怎么办？

你可以用鼠标拖拽节点来调整位置。重新加载页面会恢复到物理模拟的位置。

---

## 文件说明

```
knowledge-map/
├── index.html           # 主应用页面
├── app.js              # 应用逻辑和交互
├── README.md           # 项目说明
├── DEPLOY.md           # 部署指南
├── ADVANCED.md         # 高级功能
├── sample-data.json    # 示例数据
└── .gitignore          # Git 忽略文件
```

## 下一步

- 📖 阅读 `README.md` 了解详细功能
- 🚀 查看 `DEPLOY.md` 部署说明
- 🔧 查看 `ADVANCED.md` 自定义应用
- 💡 开始创建你自己的知识地图！

---

**需要帮助？** 在 GitHub 上开 Issue 或查看文档。

祝你学习愉快！🎓
