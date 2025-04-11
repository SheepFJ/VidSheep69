// 最近处理逻辑

// 最近
function showList() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 显示加载动画
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadAnimation(loadingResults);
        setTimeout(() => {
            loadingResults.innerHTML = "";
        }, 3000);
    }
    
    // 显示主容器
    const mainContainer = document.getElementById("main-container");
    mainContainer.style.display = 'block';
}