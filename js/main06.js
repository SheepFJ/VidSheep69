// 发送请求渲染页面








// 我的页面--关于--历史版本
const mainContainer = document.getElementById("main-container");
mainContainer.innerHTML = `
<div class="user-container">
        <h1 class="user-title">\${username}</h1>
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



// 打开关闭user对话栏
window.toggleCollapsible = function (element) {
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
};

// DOM加载完成后添加事件监听
document.querySelectorAll('.user-collapsible-header').forEach(header => {
    header.addEventListener('click', () => toggleCollapsible(header));
});
