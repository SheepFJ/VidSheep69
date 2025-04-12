// user2.js - 用户页面相关的样式和交互逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化事件监听器
    initUserEvents();
});

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
