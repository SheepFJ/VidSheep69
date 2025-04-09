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
    <div id="loading-results"></div>
    <div id="search-imglist"></div>
`;
}

// 搜索
function search() {
    //获取搜索源与搜索内容
    var wd = encodeURIComponent(document.getElementById("searchInput").value);
    var source = document.getElementById("sourceSelect").value;

    if (!wd) {
        alert("请输入搜索内容");
        return;
    }

    // 显示加载提示
    var loadingResults = document.getElementById("loading-results");
    loadAnimation(loadingResults);

    var apiUrl = "https://api.sheep.com/sheep/videoPolymerization/videoword/" + source + "/?wd=" + wd;

    fetch(apiUrl)
        .then(res => res.json())
        .then(response => {
            loadingResults.innerHTML = "";
            const searchImgList = document.getElementById("search-imglist");

            if (!response.success || response.total === 0) {
                searchImgList.innerHTML = '<div class="no-results">未找到相关影视，尝试切换源~</div>';
                return;
            }

            // 创建搜索结果容器
            const mainContainer = document.createElement('div');
            mainContainer.className = 'search-results-container';

            // 用于临时存储三个一组的电影项
            let rowDiv = null;
            let count = 0;

            // 遍历存储的数据
            Object.entries(response.data).forEach(([key, value]) => {
                // 解析存储的数据
                const [vodName, vodPic, vodContent, ...episodes] = value.split(',');
                
                // 每三个项目创建一个新的行div
                if (count % 3 === 0) {
                    rowDiv = document.createElement('div');
                    rowDiv.className = 'movie-row';
                    mainContainer.appendChild(rowDiv);
                }
                
                // 创建单个电影容器
                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie-item';

                // 创建图片
                const img = document.createElement('img');
                img.src = vodPic;
                img.alt = vodName;
                img.onerror = function() { 
                    this.src = 'https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep69/img/no-image.jpg';
                };
                img.loading = 'lazy';

                // 创建标题
                const titleSpan = document.createElement('span');
                titleSpan.className = 'movie-title';
                titleSpan.textContent = vodName;

                // 组装电影项
                movieDiv.appendChild(img);
                movieDiv.appendChild(titleSpan);

                // 添加点击事件
                movieDiv.addEventListener('click', () => {
                    showVideoDetail(vodName, vodPic, vodContent, episodes);
                });

                // 将电影项添加到行div中
                rowDiv.appendChild(movieDiv);
                count++;
            });

            // 将主容器添加到search-imglist div中
            searchImgList.innerHTML = '';
            searchImgList.appendChild(mainContainer);
        })
        .catch(err => {
            console.error("请求失败", err);
            searchImgList.innerHTML = '<div class="no-results">搜索失败，请稍后重试</div>';
        });
}

// 显示视频详情
function showVideoDetail(vodName, vodPic, vodContent, episodes) {
    const mainContainer = document.getElementById("main-container");
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
                    <img src="${vodPic}" onerror="this.src='https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep69/img/no-image.png'" alt="${vodName}">
                </div>
                <div class="video-content">
                    <h3>简介</h3>
                    <p>${vodContent}</p>
                </div>
            </div>
            <div class="episodes-list">
                <h3>剧集列表</h3>
                <div class="episodes-grid">
                    ${episodes.map(episode => {
                        const [title, url] = episode.split(': ');
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
}

// 最近
function showList() {
    var loadingResults = document.getElementById("loading-results");
    loadAnimation(loadingResults);
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

