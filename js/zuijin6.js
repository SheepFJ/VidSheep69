// 最近
function showList() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏主容器，但保留导航栏
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 获取最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (!recentContainer) return;
    
    // 清空容器并创建基本结构
    recentContainer.innerHTML = `
        <div class="recent-header">
            <button class="back-button" onclick="closeRecentContainer()">
                <i class="iconfont icon-fanhui"></i>
            </button>
            <h1 class="recent-title">最近观看</h1>
        </div>
        <div class="recent-content" id="recent-content">
            <div class="loading-all">
                <div class="loading-animation"></div>
                <div class="loading-text">加载中...</div>
            </div>
        </div>
    `;
    
    // 显示最近观看容器
    recentContainer.style.display = 'block';
    // 强制回流并添加可见性类
    setTimeout(() => {
        recentContainer.classList.add('visible');
    }, 10);
    
    // 给底部导航栏的"最近"按钮添加激活样式
    const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
    navButtons.forEach(button => {
        button.classList.remove('nav-active');
    });
    const listBtn = document.getElementById('listBtn');
    if (listBtn) {
        listBtn.classList.add('nav-active');
    }
    
    // 发送请求获取所有影片信息
    fetch('https://api.sheep.com/sheep/videoPolymerization/videolist/999')
        .then(res => res.json())
        .then(response => {
            const recentContent = document.getElementById('recent-content');
            
            // 如果没有找到容器或请求失败，显示错误信息
            if (!recentContent || !response.success || response.total === 0 || !response.data) {
                if (recentContent) {
                    recentContent.innerHTML = '<div class="no-recent">还没有观看记录~</div>';
                }
                return;
            }
            
            // 创建结果容器
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-grid';
            
            // 获取所有条目并转换为数组
            const entries = Object.entries(response.data);
            
            // 反向排序，使最新的记录显示在前面（假设索引越大表示越新）
            const sortedEntries = entries.sort((a, b) => {
                // 从键名中提取索引值
                const indexA = parseInt(a[0].split('_').pop());
                const indexB = parseInt(b[0].split('_').pop());
                // 降序排序
                return indexB - indexA;
            });
            
            // 遍历返回的数据
            sortedEntries.forEach(([key, value], index) => {
                // 使用通用函数解析数据
                const videoData = parseVideoData(value);
                
                // 跳过没有标题的数据
                if (!videoData.title || videoData.title === '未知标题') return;
                
                // 创建电影容器
                const container = document.createElement("div");
                container.className = "movie-container";
                
                // 创建图片
                const img = document.createElement("img");
                img.src = videoData.image;
                img.onerror = function() { 
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
                };
                
                // 创建标题
                const title = document.createElement("div");
                title.className = "movie-title";
                title.textContent = videoData.title;
                
                // 获取实际存储索引值
                const actualIndex = parseInt(key.split('_').pop());
                
                // 添加点击事件 - 直接请求详情
                container.addEventListener('click', function() {
                    // 显示加载动画
                    const loadingResults = document.getElementById("loading-results");
                    if (loadingResults) loadAnimation(loadingResults);
                    
                    // 保存当前实际索引到localStorage
                    localStorage.setItem('currentMovieActualIndex', actualIndex);
                    
                    // 渲染详情页面
                    renderVideoDetail({ [key]: value });
                    
                    // 清除加载动画
                    if (loadingResults) loadingResults.innerHTML = "";
                });
                
                // 组装元素
                container.appendChild(img);
                container.appendChild(title);
                resultsContainer.appendChild(container);
            });
            
            // 如果没有有效数据，显示提示
            if (resultsContainer.children.length === 0) {
                recentContent.innerHTML = '<div class="no-recent">还没有观看记录~</div>';
                return;
            }
            
            // 替换加载动画为结果
            recentContent.innerHTML = '';
            recentContent.appendChild(resultsContainer);
        })
        .catch(err => {
            console.error("获取最近观看记录失败", err);
            const recentContent = document.getElementById('recent-content');
            if (recentContent) {
                recentContent.innerHTML = '<div class="no-recent">加载失败，请稍后重试</div>';
            }
        });
}

// 关闭最近观看容器
function closeRecentContainer() {
    const recentContainer = document.getElementById('recent-container');
    const mainContainer = document.getElementById('main-container');
    
    if (recentContainer) {
        // 移除可见性类，触发过渡效果
        recentContainer.classList.remove('visible');
        
        // 等待过渡完成后隐藏容器
        setTimeout(() => {
            recentContainer.style.display = 'none';
            // 显示主容器
            if (mainContainer) {
                mainContainer.style.display = 'block';
            }
        }, 300); // 等待过渡完成
    } else if (mainContainer) {
        // 如果没有找到最近容器，直接显示主容器
        mainContainer.style.display = 'block';
    }
    
    // 更新导航按钮状态 - 设置"我的"为活跃
    const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
    navButtons.forEach(button => {
        button.classList.remove('nav-active');
    });
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.classList.add('nav-active');
    }
}

// 加载动画函数
function loadAnimation(container) {
    container.innerHTML = `
     <div class="loading-all">
         <div class="loading-animation"></div>
         <div class="loading-text">加载中...</div>
     </div>
 `;
}   