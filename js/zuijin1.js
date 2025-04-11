// 最近处理逻辑

// 最近
function showList() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    const mainContainer = document.getElementById("main-container");
    
    if (playContainer && mainContainer) {
        playContainer.style.display = 'none';
        mainContainer.style.display = 'none';
    }

    document.getElementById('recent-container').style.display = 'block';
    document.getElementById('recent-container').innerHTML = '这是最近页面';
    

}   