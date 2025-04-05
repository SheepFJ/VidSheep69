// 等待动画加载
function loadAnimation(results) {
    results.innerHTML = `
        <div class="loading-all">
            <div class="loading-animation"></div>
            <div class="loading-text">加载中...</div>
        </div>
    `;
}


function showSearch() {
    var results = document.getElementById("results");
    loadAnimation(results);
}