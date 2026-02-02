# 知识地图数据结构说明

## 概述

本知识地图包含 **34 个节点** 和 **41 条关系边**，构建了一个完整的学习路径体系，涵盖计算机科学、数学、经济学和软技能四大领域。

---

## 节点分类

### 1. 概念节点 (Concept Nodes) - 8 个
概念节点代表学科领域或能力框架，用菱形表示，颜色鲜艳。

#### 计算机科学领域
- **Computer Science** (`concept_cs`)
  - 核心：编程、算法、系统设计
  - 依赖：数学基础

- **Programming Skills** (`skill_programming`)
  - 能力：掌握多种编程语言
  - 包含课程：Python、Java、C++、JavaScript

- **Problem Solving** (`skill_problem_solving`)
  - 能力：算法设计、时间空间优化
  - 培养课程：数据结构与算法

#### 系统与架构
- **System Design** (`concept_systems`)
  - 能力：大规模系统架构设计
  - 包含课程：系统设计与架构

#### 数据与AI
- **Machine Learning & AI** (`concept_ml`)
  - 能力：数据驱动智能系统
  - 包含课程：ML、深度学习、NLP、计算机视觉

#### 数学基础
- **Mathematics Foundations** (`concept_math`)
  - 学科：离散数学、线性代数、概率统计
  - 应用：支撑CS和经济学

#### 经济学
- **Economics** (`concept_economics`)
  - 学科：微观经济学、宏观经济学
  - 依赖：数学基础

#### 软技能
- **Soft Skills** (`concept_soft_skills`)
  - 能力：沟通、团队合作、领导力
  - 包含课程：技术沟通、团队协作

---

### 2. 课程节点 (Course Nodes) - 26 个
课程节点代表具体的学习课程或实践活动，用方形表示，颜色多样。

#### 编程基础 (4门)
- **Python Programming** - 入门首选，广泛应用
- **Java OOP** - 企业级编程，强调面向对象
- **C++ Systems Programming** - 系统级编程，高性能
- **JavaScript Web Development** - 前端开发基础

#### 核心CS课程 (6门)
- **Data Structures & Algorithms** - CS必修课
- **OOP Design & Patterns** - 代码组织与设计
- **Database Systems** - 数据持久化
- **Operating Systems** - 系统层面理解
- **Computer Networks** - 网络通信
- **Web Development Full Stack** - 完整Web开发

#### 系统设计 (1门)
- **Systems Design & Architecture** - 大规模系统设计

#### 数学课程 (3门)
- **Discrete Mathematics** - CS的数学基础
- **Linear Algebra** - 机器学习基础
- **Probability & Statistics** - 数据分析基础

#### 机器学习与AI (4门)
- **Machine Learning Fundamentals** - ML入门
- **Deep Learning** - 神经网络与深度学习
- **Natural Language Processing** - 文本与语言
- **Computer Vision** - 图像处理与分析

#### 数据处理 (1门)
- **Data Analysis & Visualization** - 数据驱动决策

#### 经济学课程 (2门)
- **Microeconomics** - 个体经济决策
- **Macroeconomics** - 宏观经济分析

#### 软技能课程 (2门)
- **Technical Communication** - 技术表达能力
- **Team Collaboration & Agile** - 敏捷开发与协作

#### 实践活动 (3门)
- **Coding Practice & Competitions** - 刷题与竞赛
- **Real-World Projects** - 实际项目开发
- **Research & Literature Review** - 前沿研究

---

## 关系类型 (41条边)

### 关系类型说明

1. **Prerequisite** (红色) - 前置关系
   - 学习A之前必须完成B
   - 示例：Python → 数据结构与算法

2. **Related** (浅绿色) - 相关关系
   - A和B相关联但无严格顺序
   - 示例：线性代数 ⟷ 概率统计

3. **Applied** (黄色) - 应用关系
   - A的知识在B中应用或强化
   - 示例：数据结构与算法 → 问题求解能力

4. **Follow** (绿色) - 进阶关系
   - B是A的进阶或扩展
   - 示例：编码练习 → 实际项目

---

## 学习路径示例

### 路径 1: 成为全栈Web开发者
```
Python编程
  ↓
数据结构与算法 → OOP设计
  ↓
JavaScript Web开发
  ↓
系统设计与架构
```

### 路径 2: 机器学习工程师
```
Python编程
  ↓
离散数学、线性代数、概率统计
  ↓
机器学习基础
  ↓
深度学习 → NLP/计算机视觉
  ↓
前沿研究阅读
```

### 路径 3: 数据科学家
```
Python编程
  ↓
线性代数、概率统计
  ↓
数据分析与可视化
  ↓
机器学习基础
  ↓
实际项目
```

### 路径 4: 经济学家/金融分析师
```
数学基础
  ↓
微观经济学
  ↓
宏观经济学
  ↓
概率统计（应用于经济）
```

---

## 节点统计

### 按类型分类
- 概念节点：8 个 (23.5%)
- 课程节点：26 个 (76.5%)

### 按学科分类
- 计算机科学：22 个课程 + 4 个概念 = 26 个
- 数学：3 个课程 + 1 个概念 = 4 个
- 经济学：2 个课程 + 1 个概念 = 3 个
- 软技能：2 个课程 + 1 个概念 = 3 个
- 实践活动：3 个

### 按难度等级
- 初级课程：Python、Java/C++/JS、OOP = 4 个
- 中级课程：数据结构、数据库、网络、数据分析 = 4 个
- 高级课程：系统设计、机器学习、深度学习 = 3 个
- 应用课程：NLP、计算机视觉、经济学 = 3 个
- 实践课程：编码练习、项目、研究 = 3 个

---

## 关键学习依赖

### 最长学习路径
```
编程基础 → 数据结构 → 系统设计
          ↓
         线性代数 → 机器学习 → 深度学习 → NLP
         概率统计 ↗              ↘ 计算机视觉
```

### 必修基础课
1. **编程语言** - 至少一门（推荐Python）
2. **数据结构与算法** - CS必修
3. **数学基础** - 特别是线性代数和概率统计（用于ML）
4. **团队协作** - 实际项目不可或缺

---

## 如何使用本知识地图

### 1. 查看整体结构
- 点击任何概念节点（菱形）查看该学科包含的课程
- 观察课程间的前置关系（红色箭头）

### 2. 规划学习路径
- 选择目标领域（如：机器学习、Web开发）
- 追踪红色箭头找出前置课程
- 按照依赖关系规划学习顺序

### 3. 理解关系
- **红色** → 必须先学
- **浅绿色** → 相关可选
- **黄色** → 知识应用点
- **绿色** → 进阶方向

### 4. 发现资源
- 点击每个课程节点
- 查看推荐的教科书和课程
- 访问推荐的在线学习平台

---

## 扩展建议

### 可添加的内容
1. **更多编程语言**：Go、Rust、TypeScript、Kotlin
2. **云计算**：AWS、GCP、Azure、Kubernetes
3. **DevOps**：CI/CD、Docker、Infrastructure as Code
4. **区块链**：加密学、智能合约、分布式系统
5. **其他AI领域**：推荐系统、强化学习、图神经网络
6. **前端框架**：React、Vue、Angular
7. **后端框架**：Django、FastAPI、Node.js、Spring
8. **数据工程**：ETL、数据管道、流处理

### 添加新节点步骤
1. 在应用界面点击"编辑"标签
2. 选择节点类型（课程或概念）
3. 填写节点信息
4. 添加关系链接
5. 导出JSON备份

---

## 数据维护

### 定期更新
- 随着新技术出现更新课程
- 根据行业变化调整依赖关系
- 更新推荐的教科书和课程资源

### 社区贡献
- 欢迎提交新课程建议
- 贡献你的学习路径
- 分享有用的学习资源

---

## 版本信息

- **版本**：1.0.0
- **创建日期**：2026年2月2日
- **节点数**：34
- **关系边数**：41
- **覆盖学科**：4 个（CS、数学、经济学、软技能）
- **推荐课程资源**：50+ 门（MIT、Stanford、Coursera 等）

---

## 许可证

本知识地图采用 CC BY-SA 4.0 许可证，欢迎在保留归属的前提下自由使用和修改。
