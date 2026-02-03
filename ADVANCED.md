# 高级功能指南

## 自定义节点颜色

编辑 `app.js` 中的 `addNode()` 函数，修改 `color` 部分：

```javascript
// 课程节点颜色
const courseColor = {
    background: '#87CEEB',  // 背景色
    border: '#4682B4',      // 边框色
    highlight: {
        background: '#6CB4EE',
        border: '#36648B'
    }
};

// 概念节点颜色
const conceptColor = {
    background: '#FFD700',  // 金色
    border: '#FFA500',
    highlight: {
        background: '#FFC700',
        border: '#FF8C00'
    }
};
```

## 自定义关系类型

在 `addEdge()` 函数中修改 `labelMap` 和 `colorMap`：

```javascript
const labelMap = {
    'prerequisite': '前置',      // 前置课程 - 红色
    'follow': '后继',            // 后继课程 - 绿色
    'related': '相关',           // 相关课程 - 浅绿
    'applied': '应用',           // 应用 - 黄色
    'custom': '自定义'           // 新增关系类型
};

const colorMap = {
    'prerequisite': '#FF6B6B',   // 红色
    'follow': '#4ECDC4',         // 绿色
    'related': '#95E1D3',        // 浅绿
    'applied': '#FFD93D',        // 黄色
    'custom': '#9B59B6'          // 自定义颜色
};
```

## 调整物理引擎

在 `initializeNetwork()` 中修改物理参数：

```javascript
const options = {
    physics: {
        enabled: true,
        stabilization: {
            iterations: 200      // 增加稳定化迭代次数
        },
        barnesHut: {
            gravitationalConstant: -15000,  // 调整引力
            centralGravity: 0.3,            // 调整中心力
            springLength: 200,              // 调整节点间距
            springConstant: 0.04            // 调整弹簧常数
        }
    }
};
```

**参数说明**：
- `gravitationalConstant`：越小，节点越聚集；越大，越分散
- `centralGravity`：向中心吸引的力，0-1 之间
- `springLength`：节点间的目标距离
- `springConstant`：边的强度，越大越硬

## 导入预设数据集

创建 `presets.js` 文件添加预设数据：

```javascript
const PRESETS = {
    'computer-science': {
        nodes: [...],
        edges: [...]
    },
    'economics': {
        nodes: [...],
        edges: [...]
    }
};

function loadPreset(name) {
    const preset = PRESETS[name];
    if (preset) {
        nodes.clear();
        edges.clear();
        nodes.add(preset.nodes);
        edges.add(preset.edges);
        saveToLocal();
    }
}
```

在 HTML 中添加预设按钮：

```html
<div class="control-section">
    <h2>加载预设</h2>
    <div class="btn-group">
        <button class="btn-secondary" onclick="loadPreset('computer-science')">CS 学科</button>
        <button class="btn-secondary" onclick="loadPreset('economics')">经济学</button>
    </div>
</div>
```

## 导出为其他格式

### 导出为 SVG

```javascript
function exportSVG() {
    const canvas = network.canvas.canvas;
    const svg = canvas.toDataURL('image/svg+xml');
    downloadFile(svg, 'knowledge-map.svg');
}
```

### 导出为 PNG

```javascript
function exportPNG() {
    const canvas = network.canvas.canvas;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'knowledge-map.png';
    link.click();
}
```

## 添加节点搜索功能

```javascript
function searchNodes(query) {
    const results = nodes.get({
        filter: node => 
            node.label.toLowerCase().includes(query.toLowerCase()) ||
            node.description.toLowerCase().includes(query.toLowerCase())
    });
    return results;
}

function highlightSearch(query) {
    const results = searchNodes(query);
    network.selectNodes(results.map(n => n.id));
}
```

## 导出为 DOT 格式（Graphviz）

```javascript
function exportDOT() {
    let dot = 'digraph KnowledgeMap {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box, style=filled];\n\n';
    
    nodes.forEach(node => {
        const color = node.type === 'concept' ? '#FFD700' : '#87CEEB';
        dot += `  "${node.id}" [label="${node.label}", fillcolor="${color}"];\n`;
    });
    
    dot += '\n';
    edges.forEach(edge => {
        dot += `  "${edge.from}" -> "${edge.to}" [label="${edge.label}"];\n`;
    });
    
    dot += '}\n';
    
    downloadFile(dot, 'knowledge-map.dot', 'text/plain');
}

function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
```

## 启用图搜索和路径查找

```javascript
function findPath(fromId, toId) {
    const visited = new Set();
    const queue = [{id: fromId, path: [fromId]}];
    
    while (queue.length > 0) {
        const {id, path} = queue.shift();
        
        if (id === toId) {
            return path;
        }
        
        if (visited.has(id)) continue;
        visited.add(id);
        
        const outgoing = edges.get({
            filter: e => e.from === id
        });
        
        outgoing.forEach(edge => {
            queue.push({
                id: edge.to,
                path: [...path, edge.to]
            });
        });
    }
    
    return null;  // 无路径
}

// 使用示例
const path = findPath('node_1', 'node_5');
if (path) {
    console.log('学习路径:', path.map(id => nodes.get(id).label).join(' → '));
}
```

## 数据统计

```javascript
function getStatistics() {
    const courseCount = nodes.get().filter(n => n.type === 'course').length;
    const conceptCount = nodes.get().filter(n => n.type === 'concept').length;
    const edgeCount = edges.get().length;
    
    const stats = {
        课程数: courseCount,
        概念数: conceptCount,
        关系数: edgeCount,
        平均关系: (edgeCount / courseCount).toFixed(2)
    };
    
    return stats;
}
```

## 配置持久化

将配置保存到 localStorage：

```javascript
const CONFIG = {
    autoSave: true,
    autoSaveInterval: 5000,  // 5秒
    theme: 'light',
    physics: true
};

function saveConfig() {
    localStorage.setItem('config', JSON.stringify(CONFIG));
}

function loadConfig() {
    const saved = localStorage.getItem('config');
    if (saved) Object.assign(CONFIG, JSON.parse(saved));
}
```

---

