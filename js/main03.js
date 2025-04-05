// 等待动画加载
function loadAnimation(loadingResults) {
    loadingResults.innerHTML = `
        <div class="loading-all">
            <div class="loading-animation"></div>
            <div class="loading-text">加载中...</div>
        </div>
    `;
}


function showSearch() {
    var loadingResults = document.getElementById("loading-results");
    loadAnimation(loadingResults);
}