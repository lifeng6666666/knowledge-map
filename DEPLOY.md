# GitHub 部署指南

## 步骤 1：初始化 Git 仓库

```bash
cd knowledge-map
git init
git add .
git commit -m "Initial commit: Knowledge Map visualization tool"
```

## 步骤 2：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 仓库名：`knowledge-map`
3. 描述：`A visual knowledge map tool for course relationships and learning paths`
4. 选择 Public（公开）
5. 点击 Create repository

## 步骤 3：推送到 GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/knowledge-map.git
git push -u origin main
```

## 步骤 4：启用 GitHub Pages

1. 进入仓库主页
2. 点击 Settings → Pages
3. Source 选择：Branch: `main` / Folder: `/ (root)`
4. 点击 Save

## 步骤 5：等待部署

- GitHub 会自动部署，通常需要 1-2 分钟
- 访问 URL：`https://YOUR_USERNAME.github.io/knowledge-map/`

## 更新数据

每次修改后：

```bash
git add .
git commit -m "Update knowledge map data"
git push
```

更改会在 1-2 分钟内自动部署。

## 备用方案：使用 GitHub CLI

如果已安装 GitHub CLI：

```bash
gh repo create knowledge-map --public --source=. --remote=origin --push
gh repo edit --enable-wiki=false
```

然后手动在 Settings → Pages 中启用 GitHub Pages。
