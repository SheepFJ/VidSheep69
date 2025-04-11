// 最近处理逻辑

// 最近
function showList() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
    }
    
    // 隐藏main-container，显示recent-container
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 获取并显示recent-container
    const recentContainer = document.getElementById("recent-container");
    if (recentContainer) {
        // 如果内容为空，添加默认内容
        if (!recentContainer.innerHTML.trim()) {
            recentContainer.innerHTML = `
                <div class="recent-header">
                    <h1>最近观看</h1>
                </div>
                <div class="recent-content">
                    <p>Hello World - 最近观看记录将显示在这里</p>
                </div>
            `;
        }
        recentContainer.style.display = 'block';
    }
    
    // 清除加载动画
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadingResults.innerHTML = "";
    }
}

// 添加一个记录最近观看的函数
function addToRecentList(videoData) {
    if (!videoData) return;
    
    // 获取recent-container
    const recentContainer = document.getElementById("recent-container");
    if (!recentContainer) return;
    
    // 从localStorage获取已有的观看记录
    let recentList = [];
    try {
        const savedList = localStorage.getItem('recentWatchList');
        if (savedList) {
            recentList = JSON.parse(savedList);
        }
    } catch (e) {
        console.error('解析历史记录失败:', e);
    }
    
    // 检查是否已存在相同的电影（基于标题）
    const existingIndex = recentList.findIndex(item => item.title === videoData.title);
    if (existingIndex !== -1) {
        // 如果已存在，移除旧的记录
        recentList.splice(existingIndex, 1);
    }
    
    // 添加到列表开头（最新的在最前面）
    recentList.unshift({
        title: videoData.title,
        image: videoData.image,
        description: videoData.description,
        index: localStorage.getItem('currentMovieIndex'),
        currentEpisode: videoData.currentEpisode || '',
        currentEpisodeUrl: videoData.currentEpisodeUrl || '',
        lastWatched: new Date().toLocaleString()
    });
    
    // 仅保留最近的10条记录
    if (recentList.length > 10) {
        recentList = recentList.slice(0, 10);
    }
    
    // 保存到localStorage
    localStorage.setItem('recentWatchList', JSON.stringify(recentList));
    
    // 更新recent-container的内容（如果当前显示的是最近页面）
    if (recentContainer.style.display === 'block') {
        updateRecentContainer();
    }
}

// 更新最近观看容器的内容
function updateRecentContainer() {
    const recentContainer = document.getElementById("recent-container");
    if (!recentContainer) return;
    
    // 从localStorage获取观看记录
    let recentList = [];
    try {
        const savedList = localStorage.getItem('recentWatchList');
        if (savedList) {
            recentList = JSON.parse(savedList);
        }
    } catch (e) {
        console.error('解析历史记录失败:', e);
    }
    
    // 创建HTML内容
    let html = `
        <div class="recent-header">
            <h1>最近观看</h1>
        </div>
    `;
    
    if (recentList.length === 0) {
        html += `
            <div class="recent-content">
                <p>还没有观看记录</p>
            </div>
        `;
    } else {
        html += `<div class="results-grid">`;
        
        recentList.forEach((item, index) => {
            html += `
                <div class="movie-container" data-index="${item.index}">
                    <img src="${item.image}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='">
                    <div class="movie-title">${item.title}</div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    recentContainer.innerHTML = html;
    
    // 添加点击事件
    const movieContainers = recentContainer.querySelectorAll('.movie-container');
    movieContainers.forEach(container => {
        container.addEventListener('click', function() {
            const movieIndex = this.getAttribute('data-index');
            if (movieIndex) {
                // 显示加载动画
                const loadingResults = document.getElementById("loading-results");
                if (loadingResults) loadAnimation(loadingResults);
                
                // 保存到localStorage
                localStorage.setItem('currentMovieIndex', movieIndex);
                
                // 请求影片详情
                const detailUrl = `https://api.sheep.com/sheep/videoPolymerization/videolist/${movieIndex}`;
                
                fetch(detailUrl)
                    .then(res => res.json())
                    .then(detailResponse => {
                        // 清除加载动画
                        if (loadingResults) loadingResults.innerHTML = "";
                        
                        // 渲染详情页面
                        if (detailResponse.success && detailResponse.data) {
                            // 隐藏recent-container
                            recentContainer.style.display = 'none';
                            
                            // 渲染详情
                            renderVideoDetail(detailResponse.data);
                        } else {
                            alert("获取影片详情失败，请稍后重试");
                        }
                    })
                    .catch(err => {
                        console.error("详情请求失败", err);
                        if (loadingResults) loadingResults.innerHTML = "";
                        alert("网络错误，请稍后重试");
                    });
            }
        });
    });
}