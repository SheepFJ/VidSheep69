// user2.js - 用户页面相关的样式和交互逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 为用户容器添加样式
    addUserContainerStyle();
    
    // 初始化事件监听器
    initUserEvents();
});

// 添加用户容器样式
function addUserContainerStyle() {
    // 检查是否已存在样式
    if (document.getElementById('user-container-style')) return;
    
    // 创建style元素
    const style = document.createElement('style');
    style.id = 'user-container-style';
    style.textContent = `
        #user-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100% - 60px); /* 减去底部导航高度 */
            background-color: rgba(0, 0, 0, 0.85);
            overflow-y: auto;
            padding: 15px;
            box-sizing: border-box;
            color: #fff;
            z-index: 10;
            display: none;
        }
        
        #user-container .username-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        #user-container .user-title {
            font-size: 24px;
            margin: 0;
            color: #f39c12;
        }
        
        #user-container .user-collapsible-container {
            margin-top: 15px;
        }
        
        #user-container .user-collapsible-item {
            margin-bottom: 10px;
            border-radius: 8px;
            overflow: hidden;
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        #user-container .user-collapsible-header {
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.1);
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        #user-container .user-collapsible-header:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        #user-container .user-collapsible-header.user-active {
            background-color: rgba(243, 156, 18, 0.2);
        }
        
        #user-container .user-collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            padding: 0 15px;
        }
        
        #user-container .user-content {
            padding: 10px 0;
        }
        
        #user-container a {
            color: #3498db;
            text-decoration: none;
        }
        
        #user-container a:hover {
            text-decoration: underline;
        }
        
        #user-container .arrow {
            transition: transform 0.3s;
        }
        
        #user-container .user-collapsible-header.user-active .arrow {
            transform: rotate(180deg);
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(style);
}

// 初始化用户页面事件
function initUserEvents() {
    // 事件委托处理折叠面板点击
    document.addEventListener('click', function(event) {
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
    
    // 底部导航栏用户按钮点击事件
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            // 激活导航按钮
            document.querySelectorAll('#bottom-nav .nav-button').forEach(btn => {
                btn.classList.remove('nav-active');
            });
            profileBtn.classList.add('nav-active');
            
            // 显示用户页面
            showProfile();
        });
    }
}

// 当其他导航按钮被点击时，确保隐藏用户容器
function hideUserContainer() {
    const userContainer = document.getElementById('user-container');
    if (userContainer) {
        userContainer.style.display = 'none';
    }
}
