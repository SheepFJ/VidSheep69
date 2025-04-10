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

// 解析视频数据的通用函数
function parseVideoData(dataString) {
    if (!dataString) {
        return {
            title: '未知标题',
            image: '',
            description: '暂无简介',
            episodes: []
        };
    }
    
    try {
        const parts = dataString.split(',');
        return {
            title: parts[0] || '未知标题',
            image: parts[1] || '',
            description: parts[2] || '暂无简介',
            episodes: parts.slice(3) || []
        };
    } catch (error) {
        console.error('解析视频数据失败:', error);
        return {
            title: '解析错误',
            image: '',
            description: '数据解析失败',
            episodes: []
        };
    }
}

// 处理详情数据的函数
function processDetailData(detailData) {
    // 如果是对象，获取第一个值
    let dataString = '';
    
    if (typeof detailData === 'object') {
        // 如果是具有data属性的API响应
        if (detailData.data && Object.values(detailData.data).length > 0) {
            dataString = Object.values(detailData.data)[0];
        } 
        // 如果直接是数据对象
        else if (Object.values(detailData).length > 0) {
            dataString = Object.values(detailData)[0];
        }
    } 
    // 如果已经是字符串
    else if (typeof detailData === 'string') {
        dataString = detailData;
    }
    
    return parseVideoData(dataString);
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
            Object.entries(response.data).forEach(([key, value], index) => {
                // 使用通用函数解析数据
                const videoData = parseVideoData(value);
                
                // 创建电影容器
                var container = document.createElement("div");
                container.className = "movie-container";
                
                // 创建图片
                var img = document.createElement("img");
                img.src = videoData.image;
                img.onerror = function() { 
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
                };
                
                // 创建标题
                var title = document.createElement("div");
                title.className = "movie-title";
                title.textContent = videoData.title;
                
                // 添加点击事件 - 修改为请求详情API
                container.addEventListener('click', function() {
                    // 显示加载动画
                    const loadingResults = document.getElementById("loading-results");
                    loadAnimation(loadingResults);
                    
                    // 获取当前索引值
                    const currentIndex = index;
                    
                    // 保存当前索引到localStorage，用于返回时获取
                    localStorage.setItem('currentMovieIndex', currentIndex);
                    
                    // 发送请求获取详情
                    const detailUrl = `https://api.sheep.com/sheep/videoPolymerization/videolist/${currentIndex}`;
                    
                    fetch(detailUrl)
                        .then(res => res.json())
                        .then(detailResponse => {
                            // 清除加载动画
                            loadingResults.innerHTML = "";
                            
                            // 渲染详情页面
                            if (detailResponse.success && detailResponse.data) {
                                renderVideoDetail(detailResponse.data);
                            } else {
                                alert("获取影片详情失败，请稍后重试");
                            }
                        })
                        .catch(err => {
                            console.error("详情请求失败", err);
                            loadingResults.innerHTML = "";
                            alert("网络错误，请稍后重试");
                        });
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

// 新的详情页面渲染函数
function renderVideoDetail(detailData) {
    // 清空先前的内容
    const mainContainer = document.getElementById('main-container');
    const searchImgList = document.getElementById('search-imglist');
    const searchImgPlay = document.getElementById('search-imgplay');
    const loadingResults = document.getElementById('loading-results');
    
    if (mainContainer) mainContainer.innerHTML = '';
    if (searchImgList) searchImgList.innerHTML = '';
    if (searchImgPlay) searchImgPlay.innerHTML = '';
    if (loadingResults) loadingResults.innerHTML = '';
    
    // 使用封装函数处理详情数据
    const videoData = processDetailData(detailData);
    
    // 保存当前电影信息到本地存储
    localStorage.setItem('currentMovie', JSON.stringify(videoData));
    
    // 创建详情页容器
    const detailPage = document.createElement('div');
    detailPage.className = 'video-detail';
    
    // 创建返回按钮
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '返回搜索';
    backButton.addEventListener('click', function() {
        showSearch();
    });
    
    // 创建头部区域
    const header = document.createElement('div');
    header.className = 'video-header';
    
    // 创建影片图片
    const movieImage = document.createElement('img');
    movieImage.className = 'video-image';
    movieImage.src = videoData.image;
    movieImage.onerror = function() { 
        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
    };
    
    // 创建影片信息
    const movieInfo = document.createElement('div');
    movieInfo.className = 'video-info';
    
    // 添加标题
    const movieTitle = document.createElement('h1');
    movieTitle.className = 'video-title';
    movieTitle.textContent = videoData.title;
    
    // 添加描述
    const movieDescription = document.createElement('p');
    movieDescription.className = 'video-description';
    movieDescription.textContent = videoData.description;
    
    // 添加信息到头部
    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieDescription);
    header.appendChild(movieImage);
    header.appendChild(movieInfo);
    
    // 创建可滚动的内容区域
    const contentArea = document.createElement('div');
    contentArea.className = 'video-content-area';
    
    // 创建播放器容器（初始隐藏）
    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    playerContainer.style.display = 'none';
    playerContainer.id = 'player-container';
    
    // 创建播放器标题
    const playerTitle = document.createElement('h2');
    playerTitle.className = 'player-title';
    playerTitle.textContent = '正在播放';
    
    // 创建播放器iframe容器
    const playerFrame = document.createElement('div');
    playerFrame.className = 'player-frame';
    playerFrame.id = 'player-frame';
    
    // 添加播放器元素
    playerContainer.appendChild(playerTitle);
    playerContainer.appendChild(playerFrame);
    
    // 创建当前播放信息显示
    const nowPlaying = document.createElement('div');
    nowPlaying.className = 'now-playing';
    nowPlaying.style.display = 'none';
    nowPlaying.id = 'now-playing';
    
    // 创建选集按钮
    const selectEpisodesButton = document.createElement('button');
    selectEpisodesButton.className = 'select-episodes-button';
    selectEpisodesButton.textContent = '点击选择剧集';
    selectEpisodesButton.id = 'select-episodes-button';
    
    // 创建剧集列表
    const episodesContainer = document.createElement('div');
    episodesContainer.className = 'episodes-container';
    episodesContainer.id = 'episodes-container';
    
    // 创建剧集标题行
    const episodesTitleRow = document.createElement('div');
    episodesTitleRow.className = 'episodes-title';
    
    // 创建剧集标题
    const episodesTitle = document.createElement('span');
    episodesTitle.textContent = '选集';
    
    // 创建关闭按钮
    const closeEpisodesBtn = document.createElement('button');
    closeEpisodesBtn.className = 'close-episodes';
    closeEpisodesBtn.innerHTML = '×';
    closeEpisodesBtn.addEventListener('click', function() {
        episodesContainer.classList.remove('show');
    });
    
    // 组装标题行
    episodesTitleRow.appendChild(episodesTitle);
    episodesTitleRow.appendChild(closeEpisodesBtn);
    
    const episodesList = document.createElement('div');
    episodesList.className = 'episodes-list';
    
    // 添加选集按钮点击事件
    selectEpisodesButton.addEventListener('click', function() {
        episodesContainer.classList.add('show');
    });
    
    // 添加剧集
    if (videoData.episodes && videoData.episodes.length > 0) {
        videoData.episodes.forEach((episode, index) => {
            // 解析剧集信息
            const epParts = episode.split(': ');
            const episodeName = epParts[0];
            const episodeUrl = epParts[1];
            
            if (!episodeUrl) return;
            
            const episodeItem = document.createElement('div');
            episodeItem.className = 'episode-item';
            episodeItem.textContent = episodeName || `第${index + 1}集`;
            
            // 添加点击播放功能 - 修改为内嵌播放
            episodeItem.addEventListener('click', function() {
                // 高亮当前选中剧集
                document.querySelectorAll('.episode-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                episodeItem.classList.add('active');
                
                // 显示播放器容器
                playerContainer.style.display = 'block';
                
                // 更新播放器标题
                playerTitle.textContent = `正在播放：${videoData.title} - ${episodeName || `第${index + 1}集`}`;
                
                // 创建或更新视频播放器
                const playerFrame = document.getElementById('player-frame');
                playerFrame.innerHTML = '';  // 清空播放器
                
                // 创建视频播放器iframe
                const videoPlayer = document.createElement('iframe');
                videoPlayer.className = 'video-player-iframe';
                videoPlayer.src = episodeUrl;
                videoPlayer.allowFullscreen = true;
                
                // 创建加载提示
                const playerLoading = document.createElement('div');
                playerLoading.className = 'player-loading';
                playerLoading.innerHTML = '<div class="loading-spinner"></div><div>视频加载中...</div>';
                
                // 视频加载完成时隐藏加载提示
                videoPlayer.addEventListener('load', function() {
                    playerLoading.style.display = 'none';
                });
                
                // 添加到播放器框架
                playerFrame.appendChild(videoPlayer);
                
                // 更新当前播放信息
                nowPlaying.textContent = `当前播放: ${episodeName || `第${index + 1}集`}`;
                nowPlaying.style.display = 'block';
                
                // 隐藏剧集列表
                episodesContainer.classList.remove('show');
                
                // 平滑滚动到播放器位置
                playerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            
            episodesList.appendChild(episodeItem);
        });
        
        // 默认选中第一集(如果有)
        if (videoData.episodes.length > 0) {
            const firstEpisode = episodesList.querySelector('.episode-item');
            if (firstEpisode) {
                // 模拟点击第一集
                setTimeout(() => {
                    firstEpisode.click();
                }, 100);
            }
        }
    } else {
        const noEpisodes = document.createElement('p');
        noEpisodes.className = 'no-episodes';
        noEpisodes.textContent = '暂无可播放剧集';
        episodesList.appendChild(noEpisodes);
        
        // 如果没有剧集，隐藏选集按钮
        selectEpisodesButton.style.display = 'none';
    }
    
    // 组装剧集容器
    episodesContainer.appendChild(episodesTitleRow);
    episodesContainer.appendChild(episodesList);
    
    // 将播放器和剧集控件添加到内容区域
    contentArea.appendChild(playerContainer);
    contentArea.appendChild(nowPlaying);
    contentArea.appendChild(selectEpisodesButton);
    contentArea.appendChild(episodesContainer);
    
    // 组装页面 - 修改顺序：返回按钮，固定头部，可滚动内容区域
    detailPage.appendChild(backButton);
    detailPage.appendChild(header);
    detailPage.appendChild(contentArea);
    
    // 添加到主容器 - 确保添加到正确的容器
    if (searchImgPlay && searchImgPlay.parentNode) {
        searchImgPlay.innerHTML = ''; // 清空容器
        searchImgPlay.appendChild(detailPage);
    } else if (mainContainer) {
        mainContainer.appendChild(detailPage);
    } else {
        // 找不到适合的容器，创建一个新的
        const fallbackContainer = document.createElement('div');
        fallbackContainer.id = 'search-imgplay';
        fallbackContainer.appendChild(detailPage);
        document.body.appendChild(fallbackContainer);
    }
}

// 修改视频播放器渲染函数
function renderVideoPlayer(url, title, episodeName) {
    // 清空内容
    const mainContainer = document.getElementById('main-container');
    const searchImgList = document.getElementById('search-imglist');
    const searchImgPlay = document.getElementById('search-imgplay');
    const loadingResults = document.getElementById('loading-results');
    
    if (mainContainer) mainContainer.innerHTML = '';
    if (searchImgList) searchImgList.innerHTML = '';
    if (searchImgPlay) searchImgPlay.innerHTML = '';
    if (loadingResults) loadingResults.innerHTML = '';

    // 创建详情页容器
    const detailPage = document.createElement('div');
    detailPage.className = 'video-detail';
    
    // 创建返回按钮
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '返回详情';
    
    // 添加返回按钮点击事件，通过索引重新获取详情
    backButton.addEventListener('click', function() {
        // 显示加载动画
        if (loadingResults) {
            loadAnimation(loadingResults);
        }
        
        // 获取保存的索引值
        const currentMovieIndex = localStorage.getItem('currentMovieIndex');
        
        if (currentMovieIndex) {
            // 通过索引值重新请求详情API
            const detailUrl = `https://api.sheep.com/sheep/videoPolymerization/videolist/${currentMovieIndex}`;
            
            fetch(detailUrl)
                .then(res => res.json())
                .then(detailResponse => {
                    // 清除加载动画
                    if (loadingResults) {
                        loadingResults.innerHTML = "";
                    }
                    
                    // 渲染详情页面
                    if (detailResponse.success && detailResponse.data) {
                        renderVideoDetail(detailResponse.data);
                    } else {
                        // 如果API请求失败，尝试使用localStorage缓存的数据
                        const savedMovieData = localStorage.getItem('currentMovie');
                        if (savedMovieData) {
                            try {
                                const movieData = JSON.parse(savedMovieData);
                                renderVideoDetail(movieData);
                            } catch (e) {
                                console.error("解析保存的电影数据失败", e);
                                showSearch(); // 失败则返回搜索页
                            }
                        } else {
                            alert("获取影片详情失败，请稍后重试");
                            showSearch();
                        }
                    }
                })
                .catch(err => {
                    console.error("详情请求失败", err);
                    if (loadingResults) {
                        loadingResults.innerHTML = "";
                    }
                    
                    // 如果API请求出错，尝试使用localStorage缓存的数据
                    const savedMovieData = localStorage.getItem('currentMovie');
                    if (savedMovieData) {
                        try {
                            const movieData = JSON.parse(savedMovieData);
                            renderVideoDetail(movieData);
                        } catch (e) {
                            console.error("解析保存的电影数据失败", e);
                            showSearch(); // 失败则返回搜索页
                        }
                    } else {
                        alert("网络错误，请稍后重试");
                        showSearch();
                    }
                });
        } else {
            // 如果没有索引值，尝试使用localStorage缓存的数据
            const savedMovieData = localStorage.getItem('currentMovie');
            if (savedMovieData) {
                try {
                    const movieData = JSON.parse(savedMovieData);
                    renderVideoDetail(movieData);
                    if (loadingResults) {
                        loadingResults.innerHTML = "";
                    }
                } catch (e) {
                    console.error("解析保存的电影数据失败", e);
                    showSearch(); // 失败则返回搜索页
                }
            } else {
                alert("无法找到原页面信息，返回搜索页");
                showSearch();
            }
        }
    });
    
    // 创建可滚动的内容区域
    const contentArea = document.createElement('div');
    contentArea.className = 'video-content-area';
    contentArea.style.marginTop = '50px'; // 为固定返回按钮留出空间
    
    // 创建播放器容器
    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    
    // 创建播放器标题
    const playerTitle = document.createElement('h2');
    playerTitle.className = 'player-title';
    playerTitle.textContent = `正在播放：${title} ${episodeName ? '- ' + episodeName : ''}`;
    
    // 创建视频播放器
    const videoPlayer = document.createElement('iframe');
    videoPlayer.className = 'video-player-iframe';
    videoPlayer.src = url;
    videoPlayer.allowFullscreen = true;
    
    // 创建播放器iframe容器
    const playerFrame = document.createElement('div');
    playerFrame.className = 'player-frame';
    playerFrame.appendChild(videoPlayer);
    
    // 创建加载提示
    const playerLoading = document.createElement('div');
    playerLoading.className = 'player-loading';
    playerLoading.innerHTML = '<div class="loading-spinner"></div><div>视频加载中...</div>';
    
    // 视频加载完成时隐藏加载提示
    videoPlayer.addEventListener('load', function() {
        playerLoading.style.display = 'none';
    });
    
    // 添加播放器元素
    playerContainer.appendChild(playerTitle);
    playerContainer.appendChild(playerFrame);
    playerFrame.appendChild(playerLoading);
    
    // 创建当前播放信息
    const nowPlaying = document.createElement('div');
    nowPlaying.className = 'now-playing';
    nowPlaying.textContent = `当前播放: ${title} ${episodeName ? '- ' + episodeName : ''}`;
    
    // 将播放器添加到内容区域
    contentArea.appendChild(playerContainer);
    contentArea.appendChild(nowPlaying);
    
    // 组装页面
    detailPage.appendChild(backButton);
    detailPage.appendChild(contentArea);
    
    // 添加到主容器 - 确保添加到正确的容器
    if (searchImgPlay && searchImgPlay.parentNode) {
        searchImgPlay.innerHTML = ''; // 清空容器
        searchImgPlay.appendChild(detailPage);
    } else if (mainContainer) {
        mainContainer.appendChild(detailPage);
    } else {
        // 找不到适合的容器，创建一个新的
        const fallbackContainer = document.createElement('div');
        fallbackContainer.id = 'search-imgplay';
        fallbackContainer.appendChild(detailPage);
        document.body.appendChild(fallbackContainer);
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

