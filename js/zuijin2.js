// 最近处理逻辑

// 解析视频数据的通用函数（从main59.js复制）
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

// 最近
function showList() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏主容器
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 更新底部导航按钮状态
    if (typeof updateNavButtonStatus === 'function') {
        updateNavButtonStatus("listBtn");
    }
    
    // 获取recent-container
    const recentContainer = document.getElementById('recent-container');
    if (!recentContainer) return;
    
    // 显示加载动画
    recentContainer.style.display = 'block';
    recentContainer.innerHTML = `
        <div class="recent-header">
            <button class="back-button" onclick="closeRecentContainer()">
                <i class="iconfont icon-fanhui"></i>
            </button>
            <h1>最近观看</h1>
        </div>
        <div class="loading-all">
            <div class="loading-animation"></div>
            <div class="loading-text">加载中...</div>
        </div>
    `;
    
    // 请求所有存储的影片信息 (listIndex=999为特殊值)
    fetch('https://api.sheep.com/sheep/videoPolymerization/videolist/999')
        .then(res => res.json())
        .then(response => {
            if (!response.success || !response.data || response.total === 0) {
                recentContainer.innerHTML = `
                    <div class="recent-header">
                        <button class="back-button" onclick="closeRecentContainer()">
                            <i class="iconfont icon-fanhui"></i>
                        </button>
                        <h1>最近观看</h1>
                    </div>
                    <div class="recent-content">
                        <p>还没有观看记录</p>
                    </div>
                `;
                return;
            }
            
            // 解析所有影片数据
            const allMovies = [];
            Object.entries(response.data).forEach(([key, value]) => {
                const parsedData = parseVideoData(value);
                const index = key.replace('sheep_vod_info_', ''); // 提取索引
                allMovies.push({
                    key: key,
                    index: index,
                    title: parsedData.title,
                    image: parsedData.image,
                    description: parsedData.description,
                    data: parsedData
                });
            });
            
            // 构建HTML界面
            let moviesHTML = `
                <div class="recent-header">
                    <button class="back-button" onclick="closeRecentContainer()">
                        <i class="iconfont icon-fanhui"></i>
                    </button>
                    <h1>最近观看</h1>
                </div>
                <div class="recent-content">
            `;
            
            if (allMovies.length > 0) {
                moviesHTML += '<div class="results-grid">';
                
                allMovies.forEach(movie => {
                    moviesHTML += `
                        <div class="movie-container" data-index="${movie.index}">
                            <img src="${movie.image}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='">
                            <div class="movie-title">${movie.title}</div>
                        </div>
                    `;
                });
                
                moviesHTML += '</div>';
            } else {
                moviesHTML += '<p>还没有观看记录</p>';
            }
            
            moviesHTML += '</div>';
            recentContainer.innerHTML = moviesHTML;
            
            // 添加点击事件
            document.querySelectorAll('#recent-container .movie-container').forEach(container => {
                container.addEventListener('click', function() {
                    const storageIndex = this.getAttribute('data-index');
                    if (storageIndex) {
                        // 显示加载动画
                        recentContainer.innerHTML = `
                            <div class="loading-all">
                                <div class="loading-animation"></div>
                                <div class="loading-text">加载中...</div>
                            </div>
                        `;
                        
                        // 直接请求详情页
                        const detailUrl = `https://api.sheep.com/sheep/videoPolymerization/videolist/${storageIndex}`;
                        
                        fetch(detailUrl)
                            .then(res => res.json())
                            .then(detailResponse => {
                                // 隐藏recent-container
                                recentContainer.style.display = 'none';
                                
                                // 渲染详情页面
                                if (detailResponse.success && detailResponse.data) {
                                    renderVideoDetail(detailResponse.data);
                                } else {
                                    alert("获取影片详情失败，请稍后重试");
                                    // 重新显示列表
                                    showList();
                                }
                            })
                            .catch(err => {
                                console.error("详情请求失败", err);
                                alert("网络错误，请稍后重试");
                                // 重新显示列表
                                showList();
                            });
                    }
                });
            });
        })
        .catch(err => {
            console.error("请求失败", err);
            recentContainer.innerHTML = `
                <div class="recent-header">
                    <button class="back-button" onclick="closeRecentContainer()">
                        <i class="iconfont icon-fanhui"></i>
                    </button>
                    <h1>最近观看</h1>
                </div>
                <div class="recent-content">
                    <p>加载失败，请稍后重试</p>
                </div>
            `;
        });
}

// 关闭最近观看容器
function closeRecentContainer() {
    const recentContainer = document.getElementById('recent-container');
    if (recentContainer) {
        recentContainer.style.display = 'none';
    }
    
    // 显示主容器
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'block';
    }
    
    // 更新导航按钮状态
    if (typeof updateNavButtonStatus === 'function') {
        updateNavButtonStatus("profileBtn");
    }
    
    // 默认回到"我的"页面
    if (typeof showProfile === 'function') {
        showProfile();
    }
}   