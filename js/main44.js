// 使用事件委托处理所有用户交互
document.getElementById('main-container').addEventListener('click', function (event) {
    const target = event.target;

    // 处理折叠面板点击
    if (target.closest('.user-collapsible-header')) {
        const header = target.closest('.user-collapsible-header');
        toggleCollapsible(header);
    }

    // 处理修改用户名按钮点击
    if (target.closest('.xiuGaiUserName')) {
        const popUpWindow = document.getElementById('PopUpWindow');
        popUpWindow.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <h3 class="popup-title">修改用户名</h3>
                    <input type="text" id="newUsername" class="popup-input" value="${username}" placeholder="请输入新的用户名">
                    <div class="popup-buttons">
                        <button class="popup-button cancel-button" >取消</button>
                        <button class="popup-button confirm-button">确认</button>
                    </div>
                </div>
            </div>
        `;
        popUpWindow.style.display = 'block';
    }


    if (target.closest('.search-button')) {
        search();
    }
});

// 处理弹窗相关的事件委托
document.getElementById('PopUpWindow').addEventListener('click', function (event) {
    const target = event.target;

    // 处理点击弹窗外部关闭
    if (target.classList.contains('popup-overlay')) {
        closeUsernamePopup();
    }

    // 处理取消按钮
    if (target.classList.contains('cancel-button')) {
        closeUsernamePopup();
    }

    // 处理确认按钮
    if (target.classList.contains('confirm-button')) {
        confirmUsernameEdit();
    }
});

// 打开关闭user对话栏
function toggleCollapsible(element) {
    // 关闭其他折叠项
    document.querySelectorAll('.user-collapsible-header.user-active').forEach(header => {
        if (header !== element) {
            header.classList.remove('user-active');
            header.nextElementSibling.style.maxHeight = "0";
        }
    });

    // 切换当前折叠项
    element.classList.toggle('user-active');
    const content = element.nextElementSibling;
    content.style.maxHeight = element.classList.contains('user-active') ? content.scrollHeight + "px" : "0";
}

// 关闭名称修改弹窗
function closeUsernamePopup() {
    const popUpWindow = document.getElementById('PopUpWindow');
    popUpWindow.style.display = 'none';
}

// 确认修改名称
function confirmUsernameEdit() {
    const newUsername = document.getElementById('newUsername').value.trim();
    if (!newUsername) {
        alert('用户名不能为空！');
        return;
    }

    // 发送请求修改用户名
    fetch(`https://api.sheep.com/sheep/videoPolymerization/userinfo/username/${encodeURIComponent(newUsername)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.username) {
                document.querySelector('.user-title').textContent = data.username;
                closeUsernamePopup();
            } else {
                alert('修改失败，请稍后重试！');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('修改失败，请稍后重试！');
        });
}

// 我的页面--关于--历史版本
function showProfile() {
    const mainContainer = document.getElementById("main-container");
    mainContainer.innerHTML = `
<div class="user-container">
    <div class="username-container">
        <h1 class="user-title">${username}</h1>
        <i class="iconfont icon-xiugai xiuGaiUserName"></i>
    </div>
    <!-- 可折叠列表 -->
    <div class="user-collapsible-container">
        <!-- 关于我们 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>关于</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <h3 style="color: #f39c12; margin-top: 10px;">版本信息</h3>
                    <p>当前版本:<a href=" https://t.me/sheep_007xiaoyang/43"
                            style="color: #3498db; text-decoration: none;" target="_blank">v1.0.0</a> </p>
                    <p>更新日期: 2025-03-31</p>
                    <p>更新内容:</p>
                    <ul style="padding-left: 20px;">
                        <li>优化了页面布局</li>
                        <li>兼容Loon</li>
                    </ul>

                    <h3 style="color: #f39c12; margin-top: 20px;">关注/反馈</h3>
                    <p>GitHub: <a href="https://github.com/SheepFJ/QuantumultX"
                            style="color: #3498db; text-decoration: none;" target="_blank">SheepFJ</a></p>
                    <p>TG群组: <a href="https://t.me/sheep_007_xiaoyang"
                            style="color: #3498db; text-decoration: none;" target="_blank">Sheep交流反馈</a></p>


                </div>
            </div>
        </div>

        <!-- 设置 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>设置</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <p>装修中...</p>
                    <!-- 这里可以添加设置选项 -->
                </div>
            </div>
        </div>

        <!-- 收藏 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>我的收藏</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <p>装修中...</p>
                    <!-- 这里可以添加收藏列表 -->
                </div>
            </div>
        </div>

        <!-- 免责声明 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>声明</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <p>本工具仅供学习交流使用，请勿用于非法用途。所有内容均来自互联网，与开发者无关。</p>
                </div>
            </div>
        </div>
        <!-- 历史版本 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>历史版本</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div>
                    <h3 style="color: #f39c12; margin-top: 10px;">v1.0.0</h3>
                    <p>更新时间: 2025-03-31</p>
                    <p>更新内容:</p>
                    <ul style="padding-left: 20px;">
                        <li>优化了页面布局</li>
                        <li>兼容Loon</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
`;
}

//发现
function disCover() {
    // 清空相关元素
    const searchImgPlay = document.getElementById("search-imgplay");
    if (searchImgPlay) {
        searchImgPlay.innerHTML = "";
    }
    
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadingResults.innerHTML = "";
    }
    
    const mainContainer = document.getElementById("main-container");
    mainContainer.innerHTML = `hello world`;
}

// 等待动画加载
function loadAnimation(loadingResults) {
    loadingResults.innerHTML = `
     <div class="loading-all">
         <div class="loading-animation"></div>
         <div class="loading-text">加载中...</div>
     </div>
 `;
}

// 搜素事件
function showSearch() {
    document.getElementById("main-container").innerHTML = `
    <h1 class="search-title">影视搜索</h1>
    <div class="search-form">
        <input class="search-input" type="text" id="searchInput" placeholder="输入影视名称">
        <select class="search-select" id="sourceSelect">
            <option value="1">源1</option>
            <option value="2">源2</option>
        </select>
        <button  class="search-button">搜索</button>
    </div>
    <div id="search-imgplay"></div>
`;
    
    // 清空loading-results
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadingResults.innerHTML = "";
    }
}


// 搜索
function search() {
    var wd = encodeURIComponent(document.getElementById("searchInput").value);
    var source = document.getElementById("sourceSelect").value;

    if (!wd) {
        alert("请输入搜索内容");
        return;
    }

    // 显示加载提示
    var results = document.getElementById("loading-results");
    loadAnimation(results);

    var apiUrl = "https://api.sheep.com/sheep/videoPolymerization/videoword/" + source + "/?wd=" + wd;

    fetch(apiUrl)
        .then(res => res.json())
        .then(response => {
            results.innerHTML = "";
            
            // 获取搜索结果容器
            const searchImgPlay = document.getElementById("search-imgplay");
            
            // 清空先前的搜索结果
            searchImgPlay.innerHTML = "";
            
            if (!response.success || response.total === 0 || !response.data) {
                searchImgPlay.innerHTML = '<div class="no-results">未找到相关影视，尝试切换源~</div>';
                return;
            }

            // 创建结果容器
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-grid';
            
            // 遍历返回的数据
            Object.entries(response.data).forEach(([key, value]) => {
                // 解析字符串格式的数据
                const parts = value.split(',');
                const vodName = parts[0];
                const vodPic = parts[1];
                const vodContent = parts[2] || '';
                const episodes = parts.slice(3);
                
                // 创建电影容器
                var container = document.createElement("div");
                container.className = "movie-item";
                
                // 创建图片
                var img = document.createElement("img");
                img.src = vodPic;
                img.onerror = function() { 
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
                };
                
                // 创建标题
                var title = document.createElement("div");
                title.className = "movie-title";
                title.textContent = vodName;
                
                // 添加点击事件
                container.addEventListener('click', function() {
                    showVideoDetail(vodName, vodPic, vodContent, episodes);
                });
                
                // 组装元素
                container.appendChild(img);
                container.appendChild(title);
                resultsContainer.appendChild(container);
            });
            
            // 添加到页面
            searchImgPlay.appendChild(resultsContainer);
        })
        .catch(err => {
            console.error("请求失败", err);
            document.getElementById("search-imgplay").innerHTML = '<div class="no-results">搜索失败，请稍后重试</div>';
        });
}

// 视频详情页面
function showVideoDetail(vodName, vodPic, vodContent, episodes) {
    const mainContainer = document.getElementById("main-container");
    
    // 清空搜索结果
    document.getElementById("search-imgplay").innerHTML = "";
    document.getElementById("loading-results").innerHTML = "";
    
    // 创建视频详情页面
    mainContainer.innerHTML = `
        <div class="video-detail">
            <div class="video-header">
                <button onclick="showSearch()" class="back-button">
                    <i class="iconfont icon-fanhui"></i>
                </button>
                <h2>${vodName}</h2>
            </div>
            <div class="video-info">
                <div class="video-poster">
                    <img src="${vodPic}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4=';" alt="${vodName}">
                </div>
                <div class="video-content">
                    <h3>简介</h3>
                    <p>${vodContent || '暂无简介'}</p>
                </div>
            </div>
            <div class="episodes-list">
                <h3>剧集列表</h3>
                <div class="episodes-grid">
                    ${episodes.map(episode => {
                        const parts = episode.split(': ');
                        const title = parts[0];
                        const url = parts[1] || '';
                        return `
                            <div class="episode-item" onclick="playVideo('${url}', '${title}')">
                                ${title}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// 播放视频
function playVideo(url, title) {
    // 实现视频播放逻辑
    console.log('播放视频:', title, url);
    
    if (url) {
        if (url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            alert(`正在播放: ${title}\n视频地址: ${url}`);
        }
    } else {
        alert('无法播放，视频地址不存在');
    }
} 

// 最近
function showList() {
    var loadingResults = document.getElementById("loading-results");
    loadAnimation(loadingResults);
    setTimeout(() => {
        loadingResults.innerHTML = "";
    }, 3000);
}

// 选中样式应用
const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener('click', () => {
        // 先移除所有按钮的active类
        navButtons.forEach(btn => btn.classList.remove('nav-active'));
        // 给当前点击的按钮添加active类
        navButtons[i].classList.add('nav-active');
    });
}

// 直接执行showProfile，不需要等待DOM加载
showProfile();

