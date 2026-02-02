// 全局变量
let nodes = new vis.DataSet();
let edges = new vis.DataSet();
let network = null;
let selectedNodeId = null;
let currentNodeType = 'course';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNetwork();
    
    // 首次加载 - 先加载中文数据，然后尝试从本地加载
    const hasLocalData = localStorage.getItem('knowledgeMapData');
    const dataVersion = localStorage.getItem('knowledgeMapVersion');
    
    // 如果没有本地数据，或者版本过旧，先加载样本数据
    if (!hasLocalData || dataVersion !== 'v2.0-cn') {
        loadSampleData();
    } else {
        loadFromLocal();
    }
    
    setupEventListeners();
    updateNodeSelectors();
});

// 加载示例数据（从 JSON 文件）
async function loadSampleData() {
    try {
        // 添加时间戳防止缓存
        const response = await fetch('knowledge-map-cn.json?t=' + new Date().getTime());
        if (!response.ok) {
            console.log('knowledge-map-cn.json not found, using default data');
            loadDefaultData();
            return;
        }
        
        const data = await response.json();
        console.log('Loaded data:', data.nodes.length, 'nodes,', data.edges.length, 'edges');
        
        if (data.nodes && data.edges) {
            // 处理节点，为概念节点添加类型标签
            let conceptCount = 0;
            data.nodes.forEach(node => {
                if (node.type !== 'course') {
                    conceptCount++;
                    // 为节点标签添加类型标识
                    if (node.type) {
                        node.label = node.label + '\n(' + node.type + ')';
                    }
                }
            });
            console.log('Found', conceptCount, 'concept nodes');
            
            nodes.add(data.nodes);
            edges.add(data.edges);
            updateNodeSelectors();
            updateJSONPreview();
            updateConceptTags();
            // 标记版本
            localStorage.setItem('knowledgeMapVersion', 'v2.0-cn');
        }
    } catch (error) {
        console.log('Error loading sample data:', error);
        loadDefaultData();
    }
}

// 更新概念标签过滤器
function updateConceptTags() {
    const conceptNodes = nodes.get({
        filter: function(item) {
            return item.type && item.type !== 'course';
        }
    });
    
    console.log('Found concept nodes:', conceptNodes.length, conceptNodes);
    
    const tagContainer = document.getElementById('conceptTags');
    if (!tagContainer) {
        console.log('Tag container not found');
        return;
    }
    
    tagContainer.innerHTML = '<button class="tag-btn active" onclick="filterByTag(null)">全部</button>';
    
    conceptNodes.forEach(node => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        const labelText = node.label.includes('\n') ? node.label.split('\n')[0] : node.label;
        btn.textContent = labelText;
        btn.onclick = function() {
            filterByTag(node.id);
        };
        tagContainer.appendChild(btn);
    });
    
    console.log('Updated concept tags with', conceptNodes.length, 'nodes');
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
            updateNodeInfo();
        } else {
            selectedNodeId = null;
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
}

// 添加节点
function addNode() {
    const name = document.getElementById('nodeName').value.trim();
    const description = document.getElementById('nodeDescription').value.trim();
    const books = document.getElementById('nodeBooks').value.trim();
    const courses = document.getElementById('nodeCourses').value.trim();
    
    if (!name) {
        showStatus('请输入节点名称', 'error');
        return;
    }
    
    const nodeId = 'node_' + Date.now();
    
    const nodeData = {
        id: nodeId,
        label: name,
        title: generateTooltip(name, description, books, courses),
        type: currentNodeType,
        description: description,
        books: books,
        courses: courses,
        shape: currentNodeType === 'concept' ? 'diamond' : 'box',
        color: currentNodeType === 'concept' ? 
            { background: '#FFD700', border: '#FFA500', highlight: { background: '#FFC700', border: '#FF8C00' } } :
            { background: '#87CEEB', border: '#4682B4', highlight: { background: '#6CB4EE', border: '#36648B' } },
        font: {
            size: currentNodeType === 'concept' ? 16 : 14,
            color: '#000'
        }
    };
    
    nodes.add(nodeData);
    
    // 清空表单
    document.getElementById('nodeName').value = '';
    document.getElementById('nodeDescription').value = '';
    document.getElementById('nodeBooks').value = '';
    document.getElementById('nodeCourses').value = '';
    
    updateNodeSelectors();
    updateJSONPreview();
    showStatus('节点添加成功', 'success');
}

// 生成 tooltip
function generateTooltip(name, description, books, courses) {
    let tooltip = `<b>${name}</b>\n`;
    if (description) tooltip += `\n${description}`;
    if (books) tooltip += `\n\n📚 教科书:\n${books}`;
    if (courses) tooltip += `\n\n🎓 课程:\n${courses}`;
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
    
    const edgeId = fromNodeId + '_' + toNodeId;
    
    // 检查关系是否已存在
    if (edges.get(edgeId)) {
        showStatus('该关系已存在', 'error');
        return;
    }
    
    const labelMap = {
        'prerequisite': '前置',
        'follow': '后继',
        'related': '相关',
        'applied': '应用'
    };
    
    const colorMap = {
        'prerequisite': '#FF6B6B',
        'follow': '#4ECDC4',
        'related': '#95E1D3',
        'applied': '#FFD93D'
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
    updateNodeInfo();
    updateNodeSelectors();
    updateJSONPreview();
    showStatus('节点已删除', 'success');
}

// 清空所有
function clearAll() {
    if (confirm('确定要清空所有节点和关系吗？此操作无法撤销。')) {
        nodes.clear();
        edges.clear();
        selectedNodeId = null;
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
    
    if (!selectedNodeId) {
        panel.innerHTML = '<p style="color: #999; font-size: 13px;">点击图表中的节点查看详情</p>';
        return;
    }
    
    const node = nodes.get(selectedNodeId);
    if (!node) return;
    
    let html = `<h3>${node.label}</h3>`;
    html += `<div class="node-detail"><strong>类型：</strong> ${node.type === 'concept' ? '概念' : '课程'}</div>`;
    
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
function loadDefaultData() {
    const defaultData = {"nodes":[{"id":"concept_cs","label":"Computer Science","type":"concept","description":"Core computer science discipline including programming, algorithms, and systems","shape":"diamond","color":{"background":"#667eea","border":"#5568d3"},"font":{"size":16,"color":"#fff"}},{"id":"concept_math","label":"Mathematics Foundations","type":"concept","description":"Mathematical foundations for computing","shape":"diamond","color":{"background":"#4facfe","border":"#3d8fd9"},"font":{"size":16,"color":"#fff"}},{"id":"concept_systems","label":"System Design","type":"concept","description":"Large-scale systems architecture and design","shape":"diamond","color":{"background":"#43e97b","border":"#38c178"},"font":{"size":16,"color":"#fff"}},{"id":"concept_ml","label":"Machine Learning & AI","type":"concept","description":"Data-driven intelligence and learning systems","shape":"diamond","color":{"background":"#fa709a","border":"#d85a7a"},"font":{"size":16,"color":"#fff"}},{"id":"concept_economics","label":"Economics","type":"concept","description":"Economic theory and analysis","shape":"diamond","color":{"background":"#feca57","border":"#ffa502"},"font":{"size":16,"color":"#000"}},{"id":"concept_soft_skills","label":"Soft Skills","type":"concept","description":"Communication, teamwork, and leadership","shape":"diamond","color":{"background":"#ff6348","border":"#ff4518"},"font":{"size":16,"color":"#fff"}},{"id":"skill_programming","label":"Programming Skills","type":"concept","description":"Core programming and coding abilities","shape":"diamond","color":{"background":"#764ba2","border":"#5d3a7d"},"font":{"size":16,"color":"#fff"}},{"id":"skill_problem_solving","label":"Problem Solving","type":"concept","description":"Algorithmic thinking and optimization","shape":"diamond","color":{"background":"#f093fb","border":"#d76fd3"},"font":{"size":16,"color":"#fff"}},{"id":"course_python","label":"Python Programming","type":"course","description":"Learn Python fundamentals and object-oriented programming","books":"Python Crash Course - Eric Matthes; Fluent Python - Luciano Ramalho","courses":"MIT 6.0001; Codecademy Python; DataCamp Python for Beginners","shape":"box","color":{"background":"#3776ab","border":"#1d4d6b"},"font":{"size":13,"color":"#fff"}},{"id":"course_java","label":"Java OOP","type":"course","description":"Java programming and object-oriented design principles","books":"Head First Java - Kathy Sierra; Effective Java - Joshua Bloch","courses":"Oracle University Java; Udacity Java Nanodegree","shape":"box","color":{"background":"#f89917","border":"#cc7a0f"},"font":{"size":13,"color":"#fff"}},{"id":"course_cpp","label":"C++ Systems Programming","type":"course","description":"C++ for systems-level and performance-critical programming","books":"C++ Programming Language - Bjarne Stroustrup; Effective C++","courses":"MIT 6.S096 Effective C++; Udacity C++ Nanodegree","shape":"box","color":{"background":"#00599c","border":"#00447a"},"font":{"size":13,"color":"#fff"}},{"id":"course_javascript","label":"JavaScript Web Development","type":"course","description":"JavaScript for frontend and web development","books":"You Dont Know JS - Kyle Simpson; Eloquent JavaScript","courses":"The Odin Project; freeCodeCamp JavaScript; Codecademy JS","shape":"box","color":{"background":"#f1e05a","border":"#c8aa00"},"font":{"size":13,"color":"#000"}},{"id":"course_dsa","label":"Data Structures & Algorithms","type":"course","description":"Essential algorithms, data structures, and complexity analysis","books":"Introduction to Algorithms (CLRS); Algorithms - Sedgewick & Wayne","courses":"MIT 6.006; Stanford CS161; Udacity DSA Nanodegree","shape":"box","color":{"background":"#e34c26","border":"#b83918"},"font":{"size":13,"color":"#fff"}},{"id":"course_oop","label":"OOP Design & Patterns","type":"course","description":"Object-oriented principles, design patterns, and refactoring","books":"Design Patterns - Gang of Four; Refactoring - Martin Fowler","courses":"Pluralsight Design Patterns; LinkedIn Learning OOP","shape":"box","color":{"background":"#9f7aea","border":"#6b4da8"},"font":{"size":13,"color":"#fff"}},{"id":"course_database","label":"Database Systems","type":"course","description":"Relational databases, SQL, design, and optimization","books":"Database Concepts - Silberschatz; SQL Performance Explained","courses":"Stanford CS145; CMU 15-445; Udacity SQL","shape":"box","color":{"background":"#336791","border":"#1f3f5c"},"font":{"size":13,"color":"#fff"}},{"id":"course_os","label":"Operating Systems","type":"course","description":"Process management, memory, file systems, concurrency","books":"Operating Systems Concepts - Silberschatz; Modern OS - Tanenbaum","courses":"MIT 6.004; Berkeley CS162; MIT 6.S081","shape":"box","color":{"background":"#1e1e1e","border":"#000"},"font":{"size":13,"color":"#fff"}},{"id":"course_networks","label":"Computer Networks","type":"course","description":"OSI model, TCP/IP, HTTP, DNS, routing, network security","books":"Computer Networks - Tanenbaum; Top-Down Approach - Kurose & Ross","courses":"Stanford CS144; Udacity Networking; Coursera Networks","shape":"box","color":{"background":"#cc342d","border":"#8b2320"},"font":{"size":13,"color":"#fff"}},{"id":"course_web_full_stack","label":"Web Development Full Stack","type":"course","description":"Full-stack web development: frontend, backend, deployment","books":"Eloquent JavaScript; You Dont Know JS; Full Stack JS - Bos","courses":"The Odin Project; freeCodeCamp; ZeroToMastery Web Dev","shape":"box","color":{"background":"#20c997","border":"#0f9c6b"},"font":{"size":13,"color":"#fff"}},{"id":"course_systems_design","label":"Systems Design & Architecture","type":"course","description":"Scalability, availability, caching, distributed systems","books":"Designing Data-Intensive Applications - Kleppmann; System Design Interview - Xu","courses":"ByteByteGo System Design; AlgoExpert System Design","shape":"box","color":{"background":"#2d3436","border":"#0a0a0a"},"font":{"size":13,"color":"#fff"}},{"id":"course_discrete_math","label":"Discrete Mathematics","type":"course","description":"Set theory, logic, graph theory, combinatorics","books":"Discrete Mathematics and Applications - Kenneth Rosen; Concrete Mathematics","courses":"MIT 6.042 Math for CS; Udacity Discrete Math","shape":"box","color":{"background":"#5865f2","border":"#3e4fb5"},"font":{"size":13,"color":"#fff"}},{"id":"course_linear_algebra","label":"Linear Algebra","type":"course","description":"Vectors, matrices, transformations, eigenvalues, applications to ML","books":"Introduction to Linear Algebra - Gilbert Strang; Linear Algebra Done Right","courses":"MIT 18.06; 3Blue1Brown Essence of Linear Algebra","shape":"box","color":{"background":"#0066cc","border":"#003d99"},"font":{"size":13,"color":"#fff"}},{"id":"course_probability_stats","label":"Probability & Statistics","type":"course","description":"Probability distributions, hypothesis testing, Bayesian inference","books":"Introduction to Probability - Bertsekas & Tsitsiklis; Statistical Rethinking","courses":"MIT 18.05; Stanford STATS 110; Coursera Statistics","shape":"box","color":{"background":"#00796b","border":"#004d40"},"font":{"size":13,"color":"#fff"}},{"id":"course_machine_learning","label":"Machine Learning Fundamentals","type":"course","description":"Supervised/unsupervised learning, feature engineering, model evaluation","books":"Hands-On ML - Aurélien Géron; Pattern Recognition and ML - Christopher Bishop","courses":"Andrew Ng ML Specialization; Fast.ai; Google ML Crash Course","shape":"box","color":{"background":"#ff7043","border":"#d84315"},"font":{"size":13,"color":"#fff"}},{"id":"course_deep_learning","label":"Deep Learning","type":"course","description":"Neural networks, CNNs, RNNs, LSTMs, Transformers, applications","books":"Deep Learning - Goodfellow & Bengio; Deep Learning for CV - Rosebrock","courses":"DeepLearning.AI Specialization; Fast.ai Practical DL; Stanford CS231N","shape":"box","color":{"background":"#e91e63","border":"#880e4f"},"font":{"size":13,"color":"#fff"}},{"id":"course_nlp","label":"Natural Language Processing","type":"course","description":"Text processing, word embeddings, language models, Transformers","books":"Speech and Language Processing - Jurafsky & Martin; NLP with Transformers","courses":"Stanford CS224N; DeepLearning.AI NLP; Hugging Face NLP Course","shape":"box","color":{"background":"#9c27b0","border":"#4a148c"},"font":{"size":13,"color":"#fff"}},{"id":"course_computer_vision","label":"Computer Vision","type":"course","description":"Image processing, feature detection, object detection, segmentation","books":"Computer Vision: Algorithms and Applications - Richard Szeliski","courses":"Stanford CS231N CNN; DeepLearning.AI CV Specialization; OpenCV","shape":"box","color":{"background":"#00bcd4","border":"#006064"},"font":{"size":13,"color":"#fff"}},{"id":"course_data_analysis","label":"Data Analysis & Visualization","type":"course","description":"Data cleaning, exploratory analysis, statistical analysis, visualization","books":"Python for Data Analysis - Wes McKinney; Data Visualization - Claus Wilke","courses":"DataCamp; Google Data Analytics; Tableau Public","shape":"box","color":{"background":"#3498db","border":"#2c3e50"},"font":{"size":13,"color":"#fff"}},{"id":"course_microeconomics","label":"Microeconomics","type":"course","description":"Individual economic decisions, supply/demand, market structures","books":"Principles of Microeconomics - Gregory Mankiw; Intermediate Microeconomics - Varian","courses":"MIT 14.01 Microeconomics; Yale ECON 115; Khan Academy","shape":"box","color":{"background":"#f39c12","border":"#c67f0a"},"font":{"size":13,"color":"#fff"}},{"id":"course_macroeconomics","label":"Macroeconomics","type":"course","description":"GDP, unemployment, inflation, monetary/fiscal policy, growth","books":"Macroeconomics - Gregory Mankiw; Advanced Macroeconomics - David Romer","courses":"MIT 14.02 Macroeconomics; Yale ECON 119; Khan Academy","shape":"box","color":{"background":"#e74c3c","border":"#c0392b"},"font":{"size":13,"color":"#fff"}},{"id":"course_communication","label":"Technical Communication","type":"course","description":"Technical writing, presentations, documentation, team communication","books":"Slide:ology - Nancy Duarte; Technical Writing - Andrew Etter","courses":"Toastmasters; Coursera Communication Skills; Skillshare","shape":"box","color":{"background":"#16a085","border":"#0d5a47"},"font":{"size":13,"color":"#fff"}},{"id":"course_teamwork","label":"Team Collaboration & Agile","type":"course","description":"Agile methodology, Scrum, Git collaboration, code review","books":"Peopleware - Tom DeMarco; The Phoenix Project - Gene Kim","courses":"Scrum.org Fundamentals; Coursera Agile; Atlassian Git Tutorials","shape":"box","color":{"background":"#8e44ad","border":"#512e5f"},"font":{"size":13,"color":"#fff"}},{"id":"practice_coding","label":"Coding Practice & Competitions","type":"course","description":"LeetCode problems, competitive programming, problem-solving practice","books":"Cracking the Coding Interview - Gayle Laakmann McDowell","courses":"LeetCode Premium; Codeforces; HackerRank; CodeSignal","shape":"box","color":{"background":"#34495e","border":"#1c2833"},"font":{"size":13,"color":"#fff"}},{"id":"practice_projects","label":"Real-World Projects","type":"course","description":"Personal projects, open-source contributions, internships, products","books":"The Mythical Man-Month - Frederick Brooks Jr.; Code Complete","courses":"GitHub Challenges; FreeCodeCamp Projects; Udacity Capstones","shape":"box","color":{"background":"#27ae60","border":"#1e8449"},"font":{"size":13,"color":"#fff"}},{"id":"practice_research","label":"Research & Literature Review","type":"course","description":"Reading papers, understanding research, staying current with AI/ML","books":"How to Read a Paper - S. Keshav; Research Methods","courses":"ArXiv.org; Google Scholar; Medium; Research blogs","shape":"box","color":{"background":"#2980b9","border":"#1b4f72"},"font":{"size":13,"color":"#fff"}}],"edges":[{"id":"cs_to_skill_prog","from":"concept_cs","to":"skill_programming","label":"requires","type":"related","arrows":"to","color":{"color":"#667eea"},"font":{"size":12}},{"id":"cs_to_skill_prob","from":"concept_cs","to":"skill_problem_solving","label":"requires","type":"related","arrows":"to","color":{"color":"#667eea"},"font":{"size":12}},{"id":"cs_to_math","from":"concept_cs","to":"concept_math","label":"depends on","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"skill_prog_to_py","from":"skill_programming","to":"course_python","label":"learn","type":"related","arrows":"to","color":{"color":"#667eea"},"font":{"size":12}},{"id":"skill_prog_to_java","from":"skill_programming","to":"course_java","label":"learn","type":"related","arrows":"to","color":{"color":"#667eea"},"font":{"size":12}},{"id":"skill_prog_to_cpp","from":"skill_programming","to":"course_cpp","label":"learn","type":"related","arrows":"to","color":{"color":"#667eea"},"font":{"size":12}},{"id":"skill_prog_to_js","from":"skill_programming","to":"course_javascript","label":"learn","type":"related","arrows":"to","color":{"color":"#667eea"},"font":{"size":12}},{"id":"py_to_dsa","from":"course_python","to":"course_dsa","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"py_to_data_analysis","from":"course_python","to":"course_data_analysis","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"py_to_ml","from":"course_python","to":"course_machine_learning","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"dsa_to_systems_design","from":"course_dsa","to":"course_systems_design","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"dsa_to_problem_solving","from":"course_dsa","to":"skill_problem_solving","label":"builds","type":"applied","arrows":"to","color":{"color":"#FFD93D"},"font":{"size":12}},{"id":"js_to_web_dev","from":"course_javascript","to":"course_web_full_stack","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"db_to_systems","from":"course_database","to":"course_systems_design","label":"component of","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"os_to_systems","from":"course_os","to":"course_systems_design","label":"component of","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"networks_to_systems","from":"course_networks","to":"course_systems_design","label":"component of","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"math_to_discrete","from":"concept_math","to":"course_discrete_math","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"math_to_linear","from":"concept_math","to":"course_linear_algebra","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"math_to_prob","from":"concept_math","to":"course_probability_stats","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"linear_to_ml","from":"course_linear_algebra","to":"course_machine_learning","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"prob_to_ml","from":"course_probability_stats","to":"course_machine_learning","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"ml_to_dl","from":"course_machine_learning","to":"course_deep_learning","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"ml_concept_to_ml_course","from":"concept_ml","to":"course_machine_learning","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"ml_concept_to_dl","from":"concept_ml","to":"course_deep_learning","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"ml_concept_to_nlp","from":"concept_ml","to":"course_nlp","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"ml_concept_to_cv","from":"concept_ml","to":"course_computer_vision","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"dl_to_nlp","from":"course_deep_learning","to":"course_nlp","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"dl_to_cv","from":"course_deep_learning","to":"course_computer_vision","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"econ_concept_to_micro","from":"concept_economics","to":"course_microeconomics","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"econ_concept_to_macro","from":"concept_economics","to":"course_macroeconomics","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"micro_to_macro","from":"course_microeconomics","to":"course_macroeconomics","label":"prerequisite","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"econ_to_math","from":"concept_economics","to":"concept_math","label":"depends on","type":"prerequisite","arrows":"to","color":{"color":"#FF6B6B"},"font":{"size":12}},{"id":"soft_to_comm","from":"concept_soft_skills","to":"course_communication","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"soft_to_team","from":"concept_soft_skills","to":"course_teamwork","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"skill_prog_to_practice","from":"skill_programming","to":"practice_coding","label":"practice","type":"applied","arrows":"to","color":{"color":"#FFD93D"},"font":{"size":12}},{"id":"practice_coding_to_projects","from":"practice_coding","to":"practice_projects","label":"advances to","type":"follow","arrows":"to","color":{"color":"#4ECDC4"},"font":{"size":12}},{"id":"teamwork_to_projects","from":"course_teamwork","to":"practice_projects","label":"applied in","type":"applied","arrows":"to","color":{"color":"#FFD93D"},"font":{"size":12}},{"id":"research_to_ml","from":"practice_research","to":"course_machine_learning","label":"frontier knowledge","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"research_to_dl","from":"practice_research","to":"course_deep_learning","label":"frontier knowledge","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"research_to_systems","from":"practice_research","to":"course_systems_design","label":"frontier knowledge","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}},{"id":"systems_concept_to_course","from":"concept_systems","to":"course_systems_design","label":"includes","type":"related","arrows":"to","color":{"color":"#95E1D3"},"font":{"size":12}}]};
    
    nodes.add(defaultData.nodes);
    edges.add(defaultData.edges);
    updateNodeSelectors();
    updateJSONPreview();
}

// 按概念标签过滤
function filterByTag(tagId) {
    const allNodes = nodes.get();
    const allEdges = edges.get();
    
    // 更新按钮状态
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event.target) {
        event.target.classList.add('active');
    }
    
    if (!tagId) {
        // 显示全部
        nodes.update(allNodes);
        edges.update(allEdges);
        network.fit();
        return;
    }
    
    // 获取与该标签相关的所有节点
    const relatedNodeIds = new Set([tagId]);
    const toExplore = [tagId];
    
    while (toExplore.length > 0) {
        const currentId = toExplore.pop();
        allEdges.forEach(edge => {
            if (edge.from === currentId && !relatedNodeIds.has(edge.to)) {
                relatedNodeIds.add(edge.to);
                toExplore.push(edge.to);
            }
            if (edge.to === currentId && !relatedNodeIds.has(edge.from)) {
                relatedNodeIds.add(edge.from);
                toExplore.push(edge.from);
            }
        });
    }
    
    // 隐藏无关节点和边
    nodes.update(allNodes.map(node => ({
        ...node,
        hidden: !relatedNodeIds.has(node.id)
    })));
    
    edges.update(allEdges.map(edge => ({
        ...edge,
        hidden: !relatedNodeIds.has(edge.from) || !relatedNodeIds.has(edge.to)
    })));
    
    network.fit();
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
