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
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
    }
    
    // 隐藏最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (recentContainer) {
        recentContainer.classList.remove('visible');
        recentContainer.style.display = 'none';
    }
    
    // 隐藏主容器
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 隐藏发现容器
    const discoverContainer = document.getElementById('discover-container');
    if (discoverContainer) {
        discoverContainer.style.display = 'none';
    }
    
    // 获取并显示用户容器
    const userContainer = document.getElementById("user-container");
    userContainer.innerHTML = `
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
    // 显示用户容器
    userContainer.style.display = 'block';
    
    // 设置用户相关事件委托
    setupUserEventDelegation();
}

// 显示用户名修改弹窗
function showUsernamePopup() {
    const popUpWindow = document.getElementById('PopUpWindow');
    popUpWindow.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3 class="popup-title">修改用户名</h3>
                <input type="text" id="newUsername" class="popup-input" value="${username}" placeholder="请输入新的用户名">
                <div class="popup-buttons">
                    <button class="popup-button cancel-button">取消</button>
                    <button class="popup-button confirm-button">确认</button>
                </div>
            </div>
        </div>
    `;
    popUpWindow.style.display = 'block';
}

// 设置用户界面事件委托
function setupUserEventDelegation() {
    // 用户容器事件委托
    document.getElementById('user-container').addEventListener('click', function(event) {
        const target = event.target;
        
        // 处理折叠面板点击
        if (target.closest('.user-collapsible-header')) {
            toggleCollapsible(target.closest('.user-collapsible-header'));
        }
        
        // 处理修改用户名按钮点击
        if (target.closest('.xiuGaiUserName')) {
            showUsernamePopup();
        }
    });
    
    // 弹出窗口事件委托
    document.getElementById('PopUpWindow').addEventListener('click', function(event) {
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
}
