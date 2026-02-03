// 全局变量
let nodes = new vis.DataSet();
let edges = new vis.DataSet();
let allNodesBackup = [];  // 备份所有原始节点
let allEdgesBackup = [];  // 备份所有原始边
let network = null;
let selectedNodeId = null;
let selectedEdgeId = null;
let currentNodeType = 'course';

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    initializeNetwork();
    
    // 强制清除旧缓存，加载最新数据
    localStorage.removeItem('knowledgeMapData');
    localStorage.removeItem('knowledgeMapVersion');
    await loadSampleData();
    
    setupEventListeners();
    updateNodeSelectors();
});

// 加载示例数据（从 JSON 文件）
async function loadSampleData() {
    try {
        // 添加时间戳防止缓存
        const url = 'knowledge-map-cn.json?t=' + new Date().getTime();
        console.log('Attempting to fetch:', url);
        const response = await fetch(url);
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
            console.log('knowledge-map-cn.json not found, status:', response.status, 'using default data');
            await loadDefaultData();
            return;
        }
        
        const data = await response.json();
        console.log('Loaded data:', data.nodes.length, 'nodes,', data.edges.length, 'edges');
        
        if (data.nodes && data.edges) {
            // 保存原始备份（在修改前）
            allNodesBackup = JSON.parse(JSON.stringify(data.nodes));
            allEdgesBackup = JSON.parse(JSON.stringify(data.edges));
            
            // 不显示悬浮 tooltip：移除 vis.js 会用到的 title 字段（详情统一在左侧面板查看）
            const cleanNodes = data.nodes.map(n => {
                const copy = { ...n };
                delete copy.title;
                return copy;
            });

            const conceptCount = cleanNodes.filter(n => n.type && n.type !== 'course').length;
            console.log('Found', conceptCount, 'concept nodes');

            nodes.add(cleanNodes);
            edges.add(data.edges);
            updateNodeSelectors();
            updateJSONPreview();
            network.fit();
            updateConceptTags();
            // 标记版本
            localStorage.setItem('knowledgeMapVersion', 'v2.0-cn');
        }
    } catch (error) {
        console.log('Error loading sample data:', error);
        await loadDefaultData();
    }
}

// 更新概念标签过滤器 - 紧凑布局，按类型颜色区分
function updateConceptTags() {
    const conceptNodes = nodes.get({
        filter: function(item) {
            return item.type && item.type !== 'course';
        }
    });
    
    console.log('Found concept nodes:', conceptNodes.length);
    
    // 按类型分组（概念只保留：学科 / 能力）
    const byType = {
        '学科': [],
        '能力': []
    };
    
    conceptNodes.forEach(node => {
        const type = node.type;
        if (byType[type]) {
            byType[type].push(node);
        }
    });
    
    const tagContainer = document.getElementById('conceptTags');
    if (!tagContainer) return;
    
    tagContainer.innerHTML = '';
    
    // 颜色映射
    const typeColors = {
        '学科': { bg: '#667eea', text: '#fff' },
        '能力': { bg: '#764ba2', text: '#fff' }
    };
    
    // 遍历每个类型的标签
    ['学科', '能力'].forEach(type => {
        const nodeList = byType[type];
        if (nodeList.length === 0) return;
        
        const colors = typeColors[type];
        const MAX_VISIBLE = 10; // 超过10个才显示下拉
        
        // 显示前MAX_VISIBLE个标签
        const visibleNodes = nodeList.slice(0, MAX_VISIBLE);
        const hiddenNodes = nodeList.slice(MAX_VISIBLE);
        
        visibleNodes.forEach(node => {
            const btn = createTagButton(node, colors);
            tagContainer.appendChild(btn);
        });
        
        // 如果有隐藏的标签，添加下拉按钮
        if (hiddenNodes.length > 0) {
            const dropdownBtn = document.createElement('div');
            dropdownBtn.style.cssText = 'position: relative; display: inline-block;';
            
            const expandBtn = document.createElement('button');
            expandBtn.className = 'tag-btn';
            expandBtn.textContent = `▼ 更多 (${hiddenNodes.length})`;
            expandBtn.style.cssText = `padding: 8px 10px; font-size: 13px; min-width: auto; white-space: nowrap; background: ${colors.bg}; color: ${colors.text}; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;`;
            
            const dropdownMenu = document.createElement('div');
            dropdownMenu.style.cssText = 'position: absolute; top: 100%; left: 0; background: white; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px; margin-top: 4px; z-index: 1000; min-width: 180px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: none;';
            
            hiddenNodes.forEach(hiddenNode => {
                const hiddenBtn = createTagButton(hiddenNode, colors);
                hiddenBtn.style.display = 'block';
                hiddenBtn.style.marginBottom = '4px';
                hiddenBtn.style.width = '100%';
                hiddenBtn.style.textAlign = 'left';
                dropdownMenu.appendChild(hiddenBtn);
            });
            
            expandBtn.onclick = function(e) {
                e.stopPropagation();
                const isVisible = dropdownMenu.style.display !== 'none';
                dropdownMenu.style.display = isVisible ? 'none' : 'block';
                expandBtn.textContent = isVisible ? `▼ 更多 (${hiddenNodes.length})` : `▲ 收起`;
            };
            
            // 点击页面其他地方关闭下拉菜单
            document.addEventListener('click', function(e) {
                if (!dropdownBtn.contains(e.target)) {
                    dropdownMenu.style.display = 'none';
                    expandBtn.textContent = `▼ 更多 (${hiddenNodes.length})`;
                }
            });
            
            dropdownBtn.appendChild(expandBtn);
            dropdownBtn.appendChild(dropdownMenu);
            tagContainer.appendChild(dropdownBtn);
        }
    });
}

// 创建标签按钮 - 带颜色
function createTagButton(node, colors) {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.textContent = node.label;
    btn.style.cssText = `padding: 8px 12px; font-size: 13px; min-width: auto; white-space: nowrap; background: ${colors.bg}; color: ${colors.text}; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;`;
    btn.onmouseover = function() {
        this.style.opacity = '0.8';
        this.style.transform = 'translateY(-2px)';
    };
    btn.onmouseout = function() {
        this.style.opacity = '1';
        this.style.transform = 'translateY(0)';
    };
    btn.onclick = function(e) {
        e.stopPropagation();
        filterByTag(node.id);
    };
    return btn;
}

// 初始化网络
function initializeNetwork() {
    const container = document.getElementById('network');
    const data = {
        nodes: nodes,
        edges: edges
    };
    
    const options = {
        physics: {
            enabled: true,
            stabilization: {
                iterations: 200
            },
            barnesHut: {
                gravitationalConstant: -15000,
                centralGravity: 0.3,
                springLength: 200,
                springConstant: 0.04
            }
        },
        interaction: {
            navigationButtons: true,
            keyboard: true,
            zoomView: true
        },
        nodes: {
            margin: 10,
            widthConstraint: {
                maximum: 200
            }
        }
    };
    
    network = new vis.Network(container, data, options);
    
    // 点击事件
    network.on('click', function(params) {
        if (params.nodes.length > 0) {
            selectedNodeId = params.nodes[0];
            selectedEdgeId = null;
            expandRelatedNodes(selectedNodeId);
            updateNodeInfo();
        } else if (params.edges.length > 0) {
            selectedEdgeId = params.edges[0];
            selectedNodeId = null;
            updateNodeInfo();
        } else {
            selectedNodeId = null;
            selectedEdgeId = null;
            // 点击空白处恢复显示全部
            expandRelatedNodes(null);
            updateNodeInfo();
        }
    });
}

// 设置节点类型
function setNodeType(type) {
    currentNodeType = type;
    document.querySelectorAll('.control-section .btn-group:first-child button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    event.target.style.background = '#667eea';
    event.target.style.color = 'white';

    const conceptTypeGroup = document.getElementById('conceptTypeGroup');
    if (conceptTypeGroup) {
        conceptTypeGroup.style.display = currentNodeType === 'concept' ? 'block' : 'none';
    }
}

// 添加节点
function addNode() {
    const name = document.getElementById('nodeName').value.trim();
    const description = document.getElementById('nodeDescription').value.trim();
    const books = document.getElementById('nodeBooks').value.trim();
    const courses = document.getElementById('nodeCourses').value.trim();
    const projects = document.getElementById('nodeProjects').value.trim();
    const conceptType = document.getElementById('nodeConceptType')?.value?.trim();
    
    if (!name) {
        showStatus('请输入节点名称', 'error');
        return;
    }

    if (currentNodeType === 'concept' && !conceptType) {
        showStatus('请选择概念类型（学科 / 能力）', 'error');
        return;
    }
    
    const nodeId = 'node_' + Date.now();
    const isConcept = currentNodeType === 'concept';
    const nodeType = isConcept ? conceptType : 'course';
    const conceptColors = {
        '学科': { background: '#667eea', border: '#5568d3', highlight: { background: '#5c6ee0', border: '#4b5fc5' } },
        '能力': { background: '#764ba2', border: '#5e3d86', highlight: { background: '#6b4295', border: '#4f3371' } }
    };
    
    const nodeData = {
        id: nodeId,
        label: name,
        type: nodeType,
        description: description,
        books: books,
        courses: courses,
        projects: projects,
        shape: isConcept ? 'diamond' : 'box',
        color: isConcept ? (conceptColors[conceptType] || { background: '#FFD700', border: '#FFA500', highlight: { background: '#FFC700', border: '#FF8C00' } }) :
            { background: '#87CEEB', border: '#4682B4', highlight: { background: '#6CB4EE', border: '#36648B' } },
        font: {
            size: isConcept ? 16 : 14,
            color: '#000'
        }
    };
    
    nodes.add(nodeData);
    
    // 清空表单
    document.getElementById('nodeName').value = '';
    document.getElementById('nodeDescription').value = '';
    document.getElementById('nodeBooks').value = '';
    document.getElementById('nodeCourses').value = '';
    document.getElementById('nodeProjects').value = '';
    if (document.getElementById('nodeConceptType')) {
        document.getElementById('nodeConceptType').value = '';
    }
    
    updateNodeSelectors();
    updateJSONPreview();
    showStatus('节点添加成功', 'success');
}

// 生成 tooltip
function generateTooltip(name, description, books, courses, projects) {
    let tooltip = `<b>${name}</b>\n`;
    if (description) tooltip += `\n${description}`;
    if (books) tooltip += `\n\n📚 教科书:\n${books}`;
    if (courses) tooltip += `\n\n🎓 课程:\n${courses}`;
    if (projects) tooltip += `\n\n🧪 项目:\n${projects}`;
    return tooltip;
}

// 添加关系
function addEdge() {
    const fromNodeId = document.getElementById('fromNode').value;
    const toNodeId = document.getElementById('toNode').value;
    const edgeType = document.getElementById('edgeType').value;
    
    if (!fromNodeId || !toNodeId) {
        showStatus('请选择起点和终点', 'error');
        return;
    }
    
    if (fromNodeId === toNodeId) {
        showStatus('起点和终点不能相同', 'error');
        return;
    }

    // Enforce the simplified relationship model:
    // - contains: concept -> course
    // - prerequisite: course -> course
    const fromNode = nodes.get(fromNodeId);
    const toNode = nodes.get(toNodeId);
    if (!fromNode || !toNode) {
        showStatus('节点不存在，请刷新后重试', 'error');
        return;
    }
    if (edgeType === 'contains') {
        if (fromNode.type === 'course' || toNode.type !== 'course') {
            showStatus('“包含”关系必须是：概念 → 课程', 'error');
            return;
        }
    }
    if (edgeType === 'prerequisite') {
        if (fromNode.type !== 'course' || toNode.type !== 'course') {
            showStatus('“前置”关系必须是：课程 → 课程', 'error');
            return;
        }
    }

    const edgeId = fromNodeId + '_' + toNodeId;
    
    // 检查关系是否已存在
    if (edges.get(edgeId)) {
        showStatus('该关系已存在', 'error');
        return;
    }
    
    const labelMap = {
        'contains': '包含',
        'prerequisite': '前置'
    };
    
    const colorMap = {
        'contains': '#95E1D3',
        'prerequisite': '#FF6B6B'
    };
    
    const edgeData = {
        id: edgeId,
        from: fromNodeId,
        to: toNodeId,
        label: labelMap[edgeType],
        type: edgeType,
        arrows: 'to',
        color: { color: colorMap[edgeType] },
        font: { size: 12 }
    };
    
    edges.add(edgeData);
    
    document.getElementById('fromNode').value = '';
    document.getElementById('toNode').value = '';
    
    updateJSONPreview();
    showStatus('关系添加成功', 'success');
}

// 删除选中节点
function deleteSelected() {
    if (!selectedNodeId) {
        showStatus('请先选中一个节点', 'error');
        return;
    }
    
    // 删除关联的边
    const relatedEdges = edges.get({
        filter: item => item.from === selectedNodeId || item.to === selectedNodeId
    });
    
    relatedEdges.forEach(edge => edges.remove(edge.id));
    
    // 删除节点
    nodes.remove(selectedNodeId);
    selectedNodeId = null;
    selectedEdgeId = null;
    updateNodeInfo();
    updateNodeSelectors();
    updateJSONPreview();
    showStatus('节点已删除', 'success');
}

// 删除选中关系
function deleteSelectedEdge() {
    if (!selectedEdgeId) {
        showStatus('请先选中一条关系', 'error');
        return;
    }
    edges.remove(selectedEdgeId);
    selectedEdgeId = null;
    updateNodeInfo();
    updateJSONPreview();
    showStatus('关系已删除', 'success');
}

// 清空所有
function clearAll() {
    if (confirm('确定要清空所有节点和关系吗？此操作无法撤销。')) {
        nodes.clear();
        edges.clear();
        selectedNodeId = null;
        selectedEdgeId = null;
        updateNodeInfo();
        updateNodeSelectors();
        updateJSONPreview();
        showStatus('已清空所有数据', 'success');
    }
}

// 清除缓存并重新加载中文数据
function clearCacheAndReload() {
    if (confirm('这将清除保存的数据，重新加载中文知识地图。是否继续？')) {
        // 清除localStorage
        localStorage.removeItem('knowledgeMapData');
        localStorage.removeItem('knowledgeMapVersion');
        
        // 清空当前数据
        nodes.clear();
        edges.clear();
        selectedNodeId = null;
        
        // 重新加载中文数据
        loadSampleData();
        
        // 更新UI
        updateNodeInfo();
        updateNodeSelectors();
        updateJSONPreview();
        updateConceptTags();
        
        showStatus('已清除缓存，重新加载中文知识地图', 'success');
    }
}

// 更新节点信息面板
function updateNodeInfo() {
    const panel = document.getElementById('nodeInfoPanel');
    
    if (!selectedNodeId && !selectedEdgeId) {
        panel.innerHTML = '<p style="color: #999; font-size: 13px;">点击图表中的节点查看详情</p>';
        return;
    }

    if (selectedEdgeId) {
        const edge = edges.get(selectedEdgeId);
        if (!edge) return;
        const fromNode = nodes.get(edge.from);
        const toNode = nodes.get(edge.to);
        const fromLabel = fromNode ? fromNode.label : edge.from;
        const toLabel = toNode ? toNode.label : edge.to;
        panel.innerHTML = `
            <h3>关系详情</h3>
            <div class="node-detail"><strong>类型：</strong> ${edge.label || edge.type || '关系'}</div>
            <div class="node-detail"><strong>从：</strong> ${fromLabel}</div>
            <div class="node-detail"><strong>到：</strong> ${toLabel}</div>
        `;
        return;
    }

    const node = nodes.get(selectedNodeId);
    if (!node) return;
    
    let html = `<h3>${node.label}</h3>`;
    let typeLabel = '概念';
    if (node.type === 'course') {
        typeLabel = '课程';
    } else if (node.type && node.type !== 'concept') {
        typeLabel = node.type;
    }
    html += `<div class="node-detail"><strong>类型：</strong> ${typeLabel}</div>`;
    
    if (node.description) {
        html += `<div class="node-detail"><strong>描述：</strong> ${node.description}</div>`;
    }
    
    if (node.books) {
        html += `<div class="node-detail"><strong>📚 教科书：</strong></div>`;
        node.books.split('\n').forEach(book => {
            if (book.trim()) {
                html += `<div class="node-detail" style="margin-left: 10px; color: #666;">• ${book.trim()}</div>`;
            }
        });
    }
    
    if (node.courses) {
        html += `<div class="node-detail"><strong>🎓 推荐课程：</strong></div>`;
        node.courses.split('\n').forEach(course => {
            if (course.trim()) {
                html += `<div class="node-detail" style="margin-left: 10px; color: #666;">• ${course.trim()}</div>`;
            }
        });
    }

    if (node.projects) {
        html += `<div class="node-detail"><strong>🧪 推荐项目：</strong></div>`;
        node.projects.split('\n').forEach(project => {
            if (project.trim()) {
                html += `<div class="node-detail" style="margin-left: 10px; color: #666;">• ${project.trim()}</div>`;
            }
        });
    }
    
    // 显示关联的边
    const relatedEdges = edges.get({
        filter: item => item.from === selectedNodeId || item.to === selectedNodeId
    });
    
    if (relatedEdges.length > 0) {
        html += `<div class="node-detail"><strong>关系：</strong></div>`;
        relatedEdges.forEach(edge => {
            const isOutgoing = edge.from === selectedNodeId;
            const otherNodeId = isOutgoing ? edge.to : edge.from;
            const otherNode = nodes.get(otherNodeId);
            const direction = isOutgoing ? '→' : '←';
            html += `<div class="node-detail" style="margin-left: 10px; color: #666;">
                ${direction} <strong>${edge.label}</strong>: ${otherNode.label}
            </div>`;
        });
    }
    
    panel.innerHTML = html;
}

// 更新节点选择器
function updateNodeSelectors() {
    const nodeList = nodes.get();
    const fromSelect = document.getElementById('fromNode');
    const toSelect = document.getElementById('toNode');
    
    const currentFromValue = fromSelect.value;
    const currentToValue = toSelect.value;
    
    fromSelect.innerHTML = '<option value="">-- 选择节点 --</option>';
    toSelect.innerHTML = '<option value="">-- 选择节点 --</option>';
    
    nodeList.forEach(node => {
        const option = `<option value="${node.id}">${node.label}</option>`;
        fromSelect.innerHTML += option;
        toSelect.innerHTML += option;
    });
    
    fromSelect.value = currentFromValue;
    toSelect.value = currentToValue;
}

// 标签页切换
function switchTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有标签按钮的活跃状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName).classList.add('active');
    
    // 标记按钮为活跃
    event.target.classList.add('active');
    
    // 如果切换到数据标签页，更新 JSON 预览
    if (tabName === 'data') {
        updateJSONPreview();
    }
}

// 更新 JSON 预览
function updateJSONPreview() {
    const data = {
        nodes: nodes.get(),
        edges: edges.get()
    };
    
    const jsonPreview = document.getElementById('jsonPreview');
    jsonPreview.textContent = JSON.stringify(data, null, 2);
}

// 下载数据
function downloadData() {
    const data = {
        nodes: nodes.get(),
        edges: edges.get()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-map-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus('数据已下载', 'success');
}

// 打开上传模态框
function openUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

// 关闭上传模态框
function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('jsonInput').value = '';
}

// 导入 JSON
function importJSON() {
    const jsonText = document.getElementById('jsonInput').value.trim();
    
    if (!jsonText) {
        showStatus('请粘贴 JSON 数据', 'error');
        return;
    }
    
    try {
        const data = JSON.parse(jsonText);
        
        if (!data.nodes || !data.edges) {
            throw new Error('JSON 格式不正确，需要包含 nodes 和 edges 属性');
        }
        
        nodes.clear();
        edges.clear();
        
        nodes.add(data.nodes);
        edges.add(data.edges);
        
        updateNodeSelectors();
        updateJSONPreview();
        closeUploadModal();
        saveToLocal();
        
        showStatus('数据导入成功', 'success');
    } catch (error) {
        showStatus(`导入失败: ${error.message}`, 'error');
    }
}

// 复制 JSON
function copyJSON() {
    const jsonText = document.getElementById('jsonPreview').textContent;
    navigator.clipboard.writeText(jsonText).then(() => {
        showStatus('JSON 已复制到剪贴板', 'success');
    });
}

// 保存到本地存储
function saveToLocal() {
    const data = {
        nodes: nodes.get(),
        edges: edges.get()
    };
    localStorage.setItem('knowledgeMapData', JSON.stringify(data));
    localStorage.setItem('knowledgeMapVersion', 'v2.0-cn');
}

// 从本地存储加载
function loadFromLocal() {
    const saved = localStorage.getItem('knowledgeMapData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            nodes.add(data.nodes);
            edges.add(data.edges);
            updateNodeSelectors();
            updateJSONPreview();
        } catch (error) {
            console.error('Failed to load data from localStorage:', error);
        }
    } else {
        loadDefaultData();
    }
}

// 加载默认数据（34个节点的完整知识地图）
async function loadDefaultData() {
    try {
        // 尝试从 knowledge-map-cn.json 加载中文数据
        const response = await fetch('knowledge-map-cn.json?t=' + new Date().getTime());
        if (response.ok) {
            const data = await response.json();
            if (data.nodes && data.edges) {
                // 不显示悬浮 tooltip：移除 title 字段
                const cleanNodes = data.nodes.map(n => {
                    const copy = { ...n };
                    delete copy.title;
                    return copy;
                });
                nodes.add(cleanNodes);
                edges.add(data.edges);
                updateNodeSelectors();
                updateJSONPreview();
                network.fit();
                return;
            }
        }
    } catch (error) {
        console.log('Failed to load from knowledge-map-cn.json:', error);
    }
    
    // 如果加载失败，使用英文默认数据
    console.log('Loading fallback data - using sample dataset');
    // 这是一个简化的备选方案 - 在生产环境中应该包含完整的中文数据
    const defaultData = {
        "nodes": [
            {"id":"concept_cs","label":"计算机科学","type":"学科","description":"计算机科学的基础学科","shape":"diamond","color":{"background":"#667eea","border":"#5568d3"},"font":{"size":16,"color":"#fff"}},
            {"id":"concept_math","label":"数学基础","type":"学科","description":"计算的数学基础","shape":"diamond","color":{"background":"#4facfe","border":"#3d8fd9"},"font":{"size":16,"color":"#fff"}},
            {"id":"course_python","label":"Python编程","type":"course","description":"Python基础","shape":"box","color":{"background":"#3776ab","border":"#1d4d6b"},"font":{"size":13,"color":"#fff"}},
            {"id":"course_dsa","label":"数据结构与算法","type":"course","description":"算法和数据结构","shape":"box","color":{"background":"#e34c26","border":"#b83918"},"font":{"size":13,"color":"#fff"}}
        ],
        "edges": [
            {"from":"concept_cs","to":"course_python","label":"包含","type":"contains","arrows":"to","color":{"color":"#95E1D3"}},
            {"from":"concept_math","to":"course_python","label":"包含","type":"contains","arrows":"to","color":{"color":"#95E1D3"}},
            {"from":"course_python","to":"course_dsa","label":"前置","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"}}
        ]
    };
    
    // 保存原始备份
    allNodesBackup = JSON.parse(JSON.stringify(defaultData.nodes));
    allEdgesBackup = JSON.parse(JSON.stringify(defaultData.edges));
    
    nodes.add(defaultData.nodes);
    edges.add(defaultData.edges);
    updateNodeSelectors();
    updateJSONPreview();
}

// 按概念标签过滤
function filterByTag(tagId) {
    console.log('=== filterByTag called ===');
    console.log('tagId:', tagId);
    
    // 获取当前所有节点
    const allCurrentNodes = nodes.get();
    const allCurrentEdges = edges.get();
    
    // 更新按钮状态
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (!tagId) {
        // 显示全部
        console.log('Showing all nodes');
        document.querySelectorAll('.tag-btn')[0].classList.add('active');
        
        // 移除所有节点的hidden标签
        const updatedNodes = allCurrentNodes.map(node => ({
            ...node,
            hidden: false
        }));
        
        const updatedEdges = allCurrentEdges.map(edge => ({
            ...edge,
            hidden: false
        }));
        
        try {
            nodes.update(updatedNodes);
            edges.update(updatedEdges);
            network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
        } catch(e) {
            console.error('Error updating nodes/edges:', e);
        }
        return;
    }
    
    // 标记当前按钮为活动
    document.querySelectorAll('.tag-btn').forEach(btn => {
        if (btn.textContent === getNodeLabel(tagId)) {
            btn.classList.add('active');
        }
    });
    
    // 获取与该标签直接相连的节点（只查一层，不递归）
    const relatedNodeIds = new Set([tagId]);
    allEdgesBackup.forEach(edge => {
        if (edge.from === tagId) {
            relatedNodeIds.add(edge.to);
        }
        if (edge.to === tagId) {
            relatedNodeIds.add(edge.from);
        }
    });
    
    console.log('Directly related node IDs:', Array.from(relatedNodeIds));
    console.log('Related nodes count:', relatedNodeIds.size);
    
    // 更新所有节点的hidden状态
    const updatedNodes = allCurrentNodes.map(node => ({
        ...node,
        hidden: !relatedNodeIds.has(node.id)
    }));
    
    // 更新所有边的hidden状态
    const updatedEdges = allCurrentEdges.map(edge => ({
        ...edge,
        hidden: !relatedNodeIds.has(edge.from) || !relatedNodeIds.has(edge.to)
    }));
    
    console.log('Updating', updatedNodes.length, 'nodes and', updatedEdges.length, 'edges');
    console.log('Hidden nodes:', updatedNodes.filter(n => n.hidden).length);
    console.log('Hidden edges:', updatedEdges.filter(e => e.hidden).length);
    
    try {
        nodes.update(updatedNodes);
        edges.update(updatedEdges);
        const visibleNodeIds = updatedNodes.filter(n => !n.hidden).map(n => n.id);
        if (visibleNodeIds.length > 0) {
            network.fit({
                nodes: visibleNodeIds,
                animation: { duration: 400, easingFunction: 'easeInOutQuad' }
            });
        }
        console.log('Filter applied successfully');
    } catch(e) {
        console.error('Error applying filter:', e);
        console.error('Error details:', e.stack);
    }
}

// 点击节点时展开其关联节点（只扩展可见集合，不强制隐藏其他已可见节点）
function expandRelatedNodes(nodeId) {
    const allCurrentNodes = nodes.get();
    const allCurrentEdges = edges.get();

    if (!nodeId) {
        // 显示全部
        const updatedNodes = allCurrentNodes.map(node => ({ ...node, hidden: false }));
        const updatedEdges = allCurrentEdges.map(edge => ({ ...edge, hidden: false }));
        try {
            nodes.update(updatedNodes);
            edges.update(updatedEdges);
            network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
        } catch (e) {
            console.error('Error resetting nodes/edges:', e);
        }
        return;
    }

    // 计算关联节点（一层）
    const relatedNodeIds = new Set([nodeId]);
    allEdgesBackup.forEach(edge => {
        if (edge.from === nodeId) relatedNodeIds.add(edge.to);
        if (edge.to === nodeId) relatedNodeIds.add(edge.from);
    });

    // 展开关联节点（不收缩已可见节点）
    const updatedNodes = allCurrentNodes.map(node => {
        if (relatedNodeIds.has(node.id)) {
            return { ...node, hidden: false };
        }
        return node;
    });

    const visibleNodeIds = updatedNodes.filter(n => !n.hidden).map(n => n.id);
    const visibleNodeSet = new Set(visibleNodeIds);
    const updatedEdges = allCurrentEdges.map(edge => ({
        ...edge,
        hidden: !visibleNodeSet.has(edge.from) || !visibleNodeSet.has(edge.to)
    }));

    try {
        nodes.update(updatedNodes);
        edges.update(updatedEdges);
        if (visibleNodeIds.length > 0) {
            network.fit({
                nodes: visibleNodeIds,
                animation: { duration: 300, easingFunction: 'easeInOutQuad' }
            });
        }
    } catch (e) {
        console.error('Error expanding related nodes:', e);
    }
}

// 获取节点标签（用于匹配按钮文本）
function getNodeLabel(nodeId) {
    const node = nodes.get(nodeId);
    if (node && node.label) {
        // 如果标签包含换行符，取第一部分
        return node.label.split('\n')[0];
    }
    return '';
}

// 设置事件监听
function setupEventListeners() {
    // 回车键提交
    document.getElementById('nodeName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            addNode();
        }
    });
    
    // 模态框外点击关闭
    window.onclick = function(event) {
        const modal = document.getElementById('uploadModal');
        if (event.target == modal) {
            closeUploadModal();
        }
    };
}

// 显示状态消息
function showStatus(message, type) {
    const container = document.getElementById('statusMessage');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = `status-message ${type}`;
    div.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}
