// 发现功能相关代码

// 发现页面主函数 - 从main72.js移动过来
function disCover() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (recentContainer) {
        recentContainer.classList.remove('visible');
        recentContainer.style.display = 'none';
    }
    
    // 隐藏用户容器
    const userContainer = document.getElementById('user-container');
    if (userContainer) {
        userContainer.style.display = 'none';
    }
    
    // 隐藏主容器
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 清空loading-results
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadingResults.innerHTML = "";
    }
    
    // 使用发现容器
    const discoverContainer = document.getElementById('discover-container');
    if (!discoverContainer) return;
    
    // 显示发现容器
    discoverContainer.style.display = 'block';
    
    // 显示发现列表，隐藏内容区域
    const discoverList = document.getElementById('discover-list');
    const discoverContent = document.getElementById('discover-content');
    
    if (discoverList && discoverContent) {
        discoverList.style.display = 'block';
        discoverContent.style.display = 'none';
        
        // 初始化发现功能列表
        showDiscoverList();
    }
    
    // 给底部导航栏的"发现"按钮添加激活样式
    const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
    navButtons.forEach(button => {
        button.classList.remove('nav-active');
    });
    const discoverBtn = document.getElementById('disCover');
    if (discoverBtn) {
        discoverBtn.classList.add('nav-active');
    }
}

// 显示发现功能列表
function showDiscoverList() {
    const discoverList = document.getElementById('discover-list');
    if (!discoverList) return;
    
    // 发现功能列表数据
    const discoverItems = [
        
        // 我的收藏
        { id: 'my-collection', title: '我的收藏', icon: 'icon-shoucang', handler: showMyCollection },

        // 修改壁纸
        { id: 'change-wallpaper', title: '修改壁纸', icon: 'icon-tupian', handler: showChangeWallpaper },
        // 选择默认源
        { id: 'select-default-source', title: '选择默认源', icon: 'icon-ziyuan', handler: showSelectDefaultSource },
        // 支持作者
        { id: 'support-author', title: '支持作者', icon: 'icon-zhichi', handler: showSupportAuthor },
        // 关于我们
        { id: 'about-us', title: '关于', icon: 'icon-guanyu', handler: showAboutUs }
    ];
    
    // 创建列表HTML
    let listHTML = '<h2 class="discover-title">发现</h2><div class="discover-items">';
    
    discoverItems.forEach(item => {
        listHTML += `
            <div class="discover-item" data-id="${item.id}">
                <div class="discover-icon">
                    <i class="iconfont ${item.icon}"></i>
                </div>
                <div class="discover-item-title">${item.title}</div>
                <div class="discover-arrow">
                    <i class="iconfont icon-youjiantou"></i>
                </div>
            </div>
        `;
    });
    
    listHTML += '</div>';
    discoverList.innerHTML = listHTML;
    
    // 添加点击事件
    discoverList.querySelectorAll('.discover-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const handler = discoverItems.find(item => item.id === id)?.handler;
            
            if (handler) {
                handler();
            }
        });
    });
}

// 返回到发现列表
function backToDiscoverList() {
    const discoverList = document.getElementById('discover-list');
    const discoverContent = document.getElementById('discover-content');
    
    if (discoverList && discoverContent) {
        discoverList.style.display = 'block';
        discoverContent.style.display = 'none';
    }
}

// 显示发现内容
function showDiscoverContent(title, content) {
    const discoverList = document.getElementById('discover-list');
    const discoverContent = document.getElementById('discover-content');
    
    if (!discoverList || !discoverContent) return;
    
    // 隐藏列表，显示内容
    discoverList.style.display = 'none';
    discoverContent.style.display = 'block';
    
    // 设置内容
    discoverContent.innerHTML = `
        <div class="discover-content-body">
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px 0;">
                <button class="discover-back-button">
                    <i class="iconfont icon-fanhui"></i>
                </button>
                <h2 style="flex: 1; text-align: center; color: #f39c12; margin: 0; font-size: 18px; padding-right: 40px;">${title}</h2>
            </div>
            ${content}
        </div>
    `;
    
    // 添加返回按钮事件
    const backButton = discoverContent.querySelector('.discover-back-button');
    if (backButton) {
        backButton.addEventListener('click', backToDiscoverList);
    }
}

// 以下是各发现功能的处理函数

// 关于我们
function showAboutUs() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-shipin" style="font-size: 48px; color: #f39c12;"></i>
                <h3>VidSheep</h3>
            </div>
            <div class="about-us-version">当前版本: 2.0.0</div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">当前版本更新内容</h4>
                <ul class="update-list">
                    <li>兼容Shadowrocket、Surge自测</li>
                    <li>增加了一些个性化设置</li>
                    <li>自设壁纸或每日更换来自bing壁纸</li>
                    <li>剧集详情中增加收藏与分享</li>
                    <li>优化页面布局与操作逻辑</li>
                    <li>更新了大量源，支持设置默认选择源</li>
                    <li>...</li>

                </ul>
            </div>
            
            <div class="version-history-container">
                <h4 class="history-title">历史版本</h4>
                
                <div class="version-item">
                    <div class="version-header">
                        <span class="version-number">v1.0.0</span>
                        <span class="version-date">2025-03-31</span>
                    </div>
                    <ul class="version-changes">
                        <li>优化了页面布局</li>
                        <li>兼容Loon</li>

                    </ul>
                </div>
            </div>
            
            <div class="about-us-desc">
                <p>本工具仅供学习交流使用，请勿用于非法用途。所有内容均来自互联网，与开发者无关。</p>
            </div>
            
            <div class="about-us-links">
                <div class="about-us-link">
                    <i class="iconfont icon-github"></i>
                    <span>GitHub: <a href="https://github.com/SheepFJ" target="_blank"> SheepFJ</a></span>
                </div>
                <div class="about-us-link">
                    <i class="iconfont icon-telegram"></i>
                    <span>Telegram群组: <a href="https://t.me/sheep_007_xiaoyang" target="_blank"> sheep_007_xiaoyang</a></span>
                </div>
                <div class="about-us-link">
                    <i class="iconfont icon-telegram"></i>
                    <span>Telegram频道: <a href="https://t.me/sheep_007xiaoyang" target="_blank"> sheep_007_xiaoyang</a></span>
                </div>
            </div>
            
        </div>
    `;
    
    showDiscoverContent('关于我们', content);
}

// 支持作者
function showSupportAuthor() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-zhichi" style="font-size: 48px; color: #f39c12;"></i>
                <h3>感谢您的支持</h3>
            </div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">自述</h4>
                <p style="color: #ddd; margin-bottom: 10px;">当前版本还是有许多不便的地方，作者将持续更新调整</p>
                <p style="color: #ddd;">如果您喜欢VidSheep这个项目，欢迎通过以下方式支持我的开发工作</p>
            </div>
            
            <div class="version-history-container" style="background-color: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                <h4 class="history-title">赞赏码</h4>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 200px; height: 200px; overflow: hidden; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);">
                        <img src="https://img.picgo.net/2025/04/13/d38d743ad92baf172119efa434ee8b1bb715a9edc0557147.jpeg" alt="收款码" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0;">扫描上方二维码加速作者更新</p>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0;">金额大于1块的扫码备注将出现在下方特别感谢中</p>
                </div>
            </div>
            
            <div class="about-us-links" style="margin-top: 20px;">
                <h4 style="color: #f39c12; margin-bottom: 15px; text-align: center;">其他支持方式</h4>
                <div class="about-us-link" style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 10px;">
                    <i class="iconfont icon-yaoqinghaoyoupengyou" style="color: #f39c12;"></i>
                    <span style="color: #ddd;">向朋友推荐VidSheep</span>
                </div>
                <div class="about-us-link" style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 10px;">
                    <i class="iconfont icon-star" style="color: #f39c12;"></i>
                    <span style="color: #ddd;">在GitHub上为项目点亮<a href="https://github.com/SheepFJ/VidSheep" target="_blank">Star</a></span>
                </div>
                <div class="about-us-link" style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 10px;">
                    <i class="iconfont icon-fankuixinxi" style="color: #f39c12;"></i>
                    <span style="color: #ddd;">提供宝贵的使用反馈和建议</span>
                </div>
            </div>
            
            <div class="about-us-update-info" style="margin-top: 20px;">
                <h4 class="update-title">特别感谢</h4>
                <p style="color: #ddd; margin-bottom: 10px;"><i class="iconfont icon-bg-label" style="color: #f39c12;"></i>增加自动跳过开头结尾的功能吧开头都是广告</p>               
            </div>
        </div>
    `;
    
    showDiscoverContent('支持作者', content);
}

// 修改壁纸
function showChangeWallpaper() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-bi" style="font-size: 48px; color: #f39c12;"></i>
                <h3>壁纸设置</h3>
            </div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">自定义壁纸</h4>
                <p style="color: #ddd; margin-bottom: 10px;">您可以通过以下设置更改壁纸、调整亮度和模糊度</p>
                <h4 class="update-title">推荐图床来获取url</h4>
                <p style="color: #ddd; margin-bottom: 10px;">请勿上传涉及个人信息的图片以保护安全:<a href="https://www.picgo.net/login" target="_blank">picgo图床</a> </p>
                
                <div class="wallpaper-settings">
                    <div class="wallpaper-form">
                        <div class="wallpaper-input-group">
                            <label class="wallpaper-label">壁纸链接：</label>
                            <input id="wallpaper-url" class="wallpaper-url-input" type="text" placeholder="请输入壁纸图片URL" value="${backgroundImage}">
                        </div>
                        
                        <div class="wallpaper-input-group">
                            <label class="wallpaper-label">亮度调整 (0-1)：</label>
                            <div class="adjust-controls">
                                <button id="brightness-down" class="adjust-btn">-</button>
                                <input id="brightness-value" class="adjust-input" type="text" value="${brightness}">
                                <button id="brightness-up" class="adjust-btn right">+</button>
                            </div>
                        </div>
                        
                        <div class="wallpaper-input-group">
                            <label class="wallpaper-label">模糊度 (0-10)：</label>
                            <div class="adjust-controls">
                                <button id="blur-down" class="adjust-btn">-</button>
                                <input id="blur-value" class="adjust-input" type="text" value="${vague}">
                                <button id="blur-up" class="adjust-btn right">+</button>
                            </div>
                        </div>
                        
                        <button id="save-wallpaper" class="save-wallpaper-btn">保存设置</button>
                    </div>
                </div>
            </div>
            
            <div class="about-us-update-info" style="margin-top: 20px;">
                <h4 class="update-title">精选壁纸</h4>
                <p style="color: #ddd; margin-bottom: 15px;">点击下方"应用"按钮使用预设壁纸</p>
                
                <div class="preset-wallpapers-grid">
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/vUIRPuYLKHeW_1700122638919535b1c4b7a7a4ba6.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/vUIRPuYLKHeW_1700122638919535b1c4b7a7a4ba6.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸1</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/GsWwJ8qQUAqD_1740639963384332315e3baafa765.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/GsWwJ8qQUAqD_1740639963384332315e3baafa765.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸2</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/i3pVGxLKGO1c_170684191840469d4113f72f0add2.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/i3pVGxLKGO1c_170684191840469d4113f72f0add2.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸3</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/PkKNT35Ufzvy_17070318020985ee9b67a8ea96c77.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/PkKNT35Ufzvy_17070318020985ee9b67a8ea96c77.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸4</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/HHbTWSI8EKdG_16560606983974b7c14937c5f3d5a.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/HHbTWSI8EKdG_16560606983974b7c14937c5f3d5a.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸5</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/da4YEBlDgsE5_17261284268934912e319fe1e7bd3.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/da4YEBlDgsE5_17261284268934912e319fe1e7bd3.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸6</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showDiscoverContent('修改壁纸', content);
    
    // 在DOM完全加载后添加事件监听器
    setTimeout(() => {
        // 亮度调整按钮
        const brightnessDown = document.getElementById('brightness-down');
        const brightnessUp = document.getElementById('brightness-up');
        const brightnessValue = document.getElementById('brightness-value');
        
        if (brightnessDown && brightnessUp && brightnessValue) {
            brightnessDown.addEventListener('click', () => {
                let value = parseFloat(brightnessValue.value);
                value = Math.max(0, value - 0.1).toFixed(1);
                brightnessValue.value = value;
            });
            
            brightnessUp.addEventListener('click', () => {
                let value = parseFloat(brightnessValue.value);
                value = Math.min(1, value + 0.1).toFixed(1);
                brightnessValue.value = value;
            });
        }
        
        // 模糊度调整按钮
        const blurDown = document.getElementById('blur-down');
        const blurUp = document.getElementById('blur-up');
        const blurValue = document.getElementById('blur-value');
        
        if (blurDown && blurUp && blurValue) {
            blurDown.addEventListener('click', () => {
                let value = parseInt(blurValue.value);
                value = Math.max(0, value - 1);
                blurValue.value = value;
            });
            
            blurUp.addEventListener('click', () => {
                let value = parseInt(blurValue.value);
                value = Math.min(10, value + 1);
                blurValue.value = value;
            });
        }
        
        // 保存壁纸设置按钮
        const saveWallpaperBtn = document.getElementById('save-wallpaper');
        if (saveWallpaperBtn) {
            saveWallpaperBtn.addEventListener('click', () => {
                const url = document.getElementById('wallpaper-url').value;
                const brightness = document.getElementById('brightness-value').value;
                const blur = document.getElementById('blur-value').value;
                
                if (!url) {
                    alert('请输入壁纸URL');
                    return;
                }
                
                saveWallpaperSettings(url, brightness, blur);
            });
        }
        
        // 预设壁纸应用按钮点击事件
        const presetApplyBtns = document.querySelectorAll('.preset-wallpaper-apply');
        presetApplyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.preset-wallpaper-item');
                const url = parent.getAttribute('data-url');
                const brightness = parent.getAttribute('data-brightness');
                const blur = parent.getAttribute('data-blur');
                
                // 更新输入框的值
                document.getElementById('wallpaper-url').value = url;
                document.getElementById('brightness-value').value = brightness;
                document.getElementById('blur-value').value = blur;
                
                // 预览效果（设置预览的背景样式）
                updateWallpaperPreview(url);
                
                // 保存设置
                saveWallpaperSettings(url, brightness, blur);
            });
        });
    }, 100);
}

// 更新壁纸预览
function updateWallpaperPreview(url) {
    document.documentElement.style.setProperty('--preview-bg-image', `url(${url})`);
}

// 保存壁纸设置 - 发送API请求
function saveWallpaperSettings(url, brightness, blur) {
    // 显示加载状态
    const saveBtn = document.getElementById('save-wallpaper');
    if (saveBtn) {
        saveBtn.innerText = '保存中...';
        saveBtn.disabled = true;
    }
    
    // 构造API请求URL
    const apiUrl = `https://api.sheep.com/sheep/videoPolymerization/api/backimage/?url=${encodeURIComponent(url)}&mingdu=${brightness}&mohu=${blur}`;
    
    // 发送请求
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 立即更新页面背景
                document.body.style.setProperty('--bg-image', `url(${url})`);
                document.body.style.setProperty('--bg-brightness', brightness);
                document.body.style.setProperty('--bg-blur', `${blur}px`);
                
                // 更新CSS变量
                document.documentElement.style.setProperty('--bg-image', `url(${url})`);
                document.documentElement.style.setProperty('--bg-brightness', brightness);
                document.documentElement.style.setProperty('--bg-blur', `${blur}px`);
                
                // 更新body的背景样式
                document.body.style.backgroundImage = `url(${url})`;
                document.body.style.filter = `brightness(${brightness}) blur(${blur}px)`;
                
                // 显示成功消息
                alert('壁纸设置已保存');
            } else {
                alert('保存失败: ' + (data.error || '未知错误'));
            }
        })
        .catch(error => {
            console.error('保存壁纸设置失败:', error);
            alert('保存失败，请稍后重试');
        })
        .finally(() => {
            // 恢复按钮状态
            if (saveBtn) {
                saveBtn.innerText = '保存设置';
                saveBtn.disabled = false;
            }
        });
}

// 我的收藏页面
function showMyCollection() {
    // 首先显示一个加载中的内容
    const loadingContent = `
        <div class="collection-content">
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>正在加载收藏内容...</p>
            </div>
        </div>
    `;
    
    showDiscoverContent('我的收藏', loadingContent);
    
    // 发送请求获取所有收藏数据
    fetch('https://api.sheep.com/sheep/videoPolymerization/api/exhibit')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || '获取收藏失败');
            }
            
            // 检查是否有收藏
            if (data.total === 0) {
                renderEmptyCollection();
                return;
            }
            
            // 渲染收藏列表 - 直接使用类似zuijin18.js的方式
            renderCollectionList(data.data);
        })
        .catch(error => {
            console.error('加载收藏失败:', error);
            renderCollectionError(error.message);
        });
}

// 渲染空收藏页面
function renderEmptyCollection() {
    const emptyContent = `
        <div class="collection-content">
            <div class="empty-collection">
                <i class="iconfont icon-shoucang" style="font-size: 48px; color: #666;"></i>
                <p>您还没有收藏任何内容</p>
                <button id="go-search-btn" class="go-search-btn">去搜索内容</button>
            </div>
        </div>
    `;
    
    const discoverContent = document.getElementById('discover-content');
    if (discoverContent) {
        const contentBody = discoverContent.querySelector('.discover-content-body');
        if (contentBody) {
            contentBody.innerHTML = contentBody.innerHTML.replace(/<div class="collection-content">.*?<\/div>/s, emptyContent);
            
            // 添加搜索按钮点击事件
            setTimeout(() => {
                const goSearchBtn = document.getElementById('go-search-btn');
                if (goSearchBtn) {
                    goSearchBtn.addEventListener('click', () => {
                        // 切换到搜索页面
                        document.getElementById('searchBtn')?.click();
                    });
                }
            }, 100);
        }
    }
}

// 渲染收藏错误页面
function renderCollectionError(errorMessage) {
    const errorContent = `
        <div class="collection-content">
            <div class="collection-error">
                <i class="iconfont icon-error" style="font-size: 48px; color: #f44336;"></i>
                <p>加载收藏失败</p>
                <p class="error-message">${errorMessage || '未知错误'}</p>
                <button id="retry-collection-btn" class="retry-btn">重试</button>
            </div>
        </div>
    `;
    
    const discoverContent = document.getElementById('discover-content');
    if (discoverContent) {
        const contentBody = discoverContent.querySelector('.discover-content-body');
        if (contentBody) {
            contentBody.innerHTML = contentBody.innerHTML.replace(/<div class="collection-content">.*?<\/div>/s, errorContent);
            
            // 添加重试按钮点击事件
            setTimeout(() => {
                const retryBtn = document.getElementById('retry-collection-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', showMyCollection);
                }
            }, 100);
        }
    }
}

// 渲染收藏列表 - 修改为类似zuijin18.js的方式
function renderCollectionList(collectionData) {
    // 创建收藏列表容器
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-grid';
    
    // 获取所有条目并转换为数组，并排序（最新添加的排在前面）
    const entries = Object.entries(collectionData);
    const sortedEntries = entries.sort((a, b) => {
        // 从键名中提取索引值
        const indexA = parseInt(a[0].split('_').pop());
        const indexB = parseInt(b[0].split('_').pop());
        // 降序排序，使最新添加的在前面
        return indexB - indexA;
    });
    
    // 遍历收藏数据
    let hasValidItems = false;
    
    sortedEntries.forEach(([key, value], index) => {
        try {
            // 使用通用函数解析数据
            const videoData = parseVideoData(value);
            
            // 跳过没有标题的数据
            if (!videoData.title || videoData.title === '未知标题') return;
            
            hasValidItems = true;
            
            // 创建电影容器
            const container = document.createElement("div");
            container.className = "movie-container";
            container.setAttribute('data-key', key);

            // 创建图片
            const img = document.createElement("img");
            img.src = videoData.image;
            img.onerror = function() { 
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
            };
            
            // 创建标题和操作区域容器
            const infoContainer = document.createElement("div");
            infoContainer.className = "movie-info-container";

            // 创建标题
            const title = document.createElement("div");
            title.className = "movie-title";
            title.textContent = videoData.title;

            // 创建取消收藏按钮
            const uncollectBtn = document.createElement("button");
            uncollectBtn.className = "uncollect-button";
            uncollectBtn.innerHTML = '<i class="iconfont icon-shoucang1" style="color: #f39c12;"></i>';
            uncollectBtn.title = "取消收藏";

            // 阻止点击取消收藏按钮时触发容器的点击事件
            uncollectBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                const key = container.getAttribute('data-key');
                const confirmRemove = confirm('确定要取消收藏该视频吗？');
                
                if (confirmRemove) {
                    // 移除此影片的DOM元素
                    container.style.opacity = '0.3';
                    container.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        container.remove();
                        
                        // 检查是否还有其他收藏项
                        const remainingItems = document.querySelectorAll('.movie-container');
                        if (remainingItems.length === 0) {
                            // 如果没有收藏项了，显示空收藏提示
                            renderEmptyCollection();
                        }
                        
                        // 显示成功消息
                        alert('已取消收藏');
                    }, 500);
                }
            });

            // 添加电影容器的点击事件
            container.addEventListener('click', function() {
                try {
                    // 隐藏发现容器
                    const discoverContainer = document.getElementById('discover-container');
                    if (discoverContainer) {
                        discoverContainer.style.display = 'none';
                    }
                    
                    // 获取播放容器并显示它
                    const playContainer = document.getElementById('play-container');
                    if (playContainer) {
                        playContainer.style.display = 'block';
                    }
                    
                    // 显示加载动画
                    const loadingResults = document.getElementById('loading-results');
                    if (loadingResults) {
                        loadingResults.innerHTML = `
                            <div class="loading-all">
                                <div class="loading-animation"></div>
                                <div class="loading-text">加载中...</div>
                            </div>
                        `;
                    }
                    
                    // 从key中提取索引
                    const collectIndex = key.split('_').pop();
                    
                    // 保存当前实际索引到localStorage，用于收藏功能
                    const videoIdMatch = key.match(/sheep_collect_(\d+)/);
                    if (videoIdMatch && videoIdMatch[1]) {
                        localStorage.setItem('currentMovieActualIndex', collectIndex);
                    }
                    
                    // 简单处理数据并直接使用main80.js中的renderVideoDetail函数
                    if (typeof renderVideoDetail === 'function') {
                        // 清除加载动画
                        if (loadingResults) {
                            loadingResults.innerHTML = '';
                        }
                        
                        // 调用main80.js中的renderVideoDetail函数处理数据
                        renderVideoDetail({ [key]: value });
                    } else {
                        console.error('renderVideoDetail函数不存在');
                        
                        // 判断是否有剧集信息
                        if (videoData.episodes && videoData.episodes.length > 0) {
                            // 使用第一集信息
                            const firstEpisode = videoData.episodes[0].split(': ');
                            const episodeTitle = firstEpisode[0];
                            const episodeUrl = firstEpisode[1];
                            
                            if (episodeUrl && typeof renderVideoPlayer === 'function') {
                                renderVideoPlayer(episodeUrl, videoData.title, episodeTitle);
                            } else {
                                alert('无法播放该视频，请稍后重试');
                            }
                        } else {
                            alert('该视频没有可播放的内容');
                        }
                    }
                } catch (e) {
                    console.error('播放视频时出错:', e);
                    alert('播放视频时出错，请稍后重试');
                }
            });

            // 组装元素
            infoContainer.appendChild(title);
            infoContainer.appendChild(uncollectBtn);
            container.appendChild(img);
            container.appendChild(infoContainer);
            resultsContainer.appendChild(container);
        } catch (e) {
            console.error(`解析收藏项 ${key} 失败:`, e);
        }
    });
    
    // 创建完整的收藏内容
    const collectionContent = document.createElement('div');
    collectionContent.className = 'collection-content';
    
    // 如果没有有效数据，显示提示
    if (!hasValidItems) {
        collectionContent.innerHTML = '<div class="no-recent">没有有效的收藏记录</div>';
    } else {
        collectionContent.appendChild(resultsContainer);
    }
    
    // 更新内容
    const discoverContent = document.getElementById('discover-content');
    if (discoverContent) {
        const contentBody = discoverContent.querySelector('.discover-content-body');
        if (contentBody) {
            // 替换加载动画为结果
            const oldCollectionContent = contentBody.querySelector('.collection-content');
            if (oldCollectionContent) {
                oldCollectionContent.replaceWith(collectionContent);
            } else {
                contentBody.appendChild(collectionContent);
            }
        }
    }
}

// 解析收藏项数据 - 与zuijin18.js保持一致的解析方式
function parseVideoData(dataString) {
    if (!dataString) {
        return {
            title: '未知标题',
            image: '',
            description: '暂无简介',
            episodes: []
        };
    }
    
    try {
        const parts = dataString.split(',');
        return {
            title: parts[0] || '未知标题',
            image: parts[1] || '',
            description: parts[2] || '暂无简介',
            episodes: parts.slice(3) || []
        };
    } catch (error) {
        console.error('解析视频数据失败:', error);
        return {
            title: '解析错误',
            image: '',
            description: '数据解析失败',
            episodes: []
        };
    }
}

// 选择默认源
function showSelectDefaultSource() {
    // 获取当前默认源
    let currentSource = "1"; // 默认值
    try {
        const userData = localStorage.getItem("sheep_userdata");
        if (userData) {
            const userDataObj = JSON.parse(userData);
            if (userDataObj.source) {
                currentSource = userDataObj.source;
            }
        }
    } catch (e) {
        console.error("获取默认源失败:", e);
    }
    
    // 源数据数组
    const sourceOptions = [
        { id: "1", name: "急速资源" },
        { id: "2", name: "魔都资源" },
        { id: "3", name: "索尼资源" },
        { id: "4", name: "速播资源" },
        { id: "5", name: "量子资源" },
        { id: "6", name: "量子资源1" },
        { id: "7", name: "飘零资源" },
        { id: "8", name: "苹果资源" },
        { id: "9", name: "360资源" },
        { id: "10", name: "光束资源" },
        { id: "11", name: "卧龙资源" },
        { id: "12", name: "暴风资源" },
        { id: "13", name: "最大资源" }
    ];

    // 生成源选择界面
    let sourceOptionsHTML = "";
    sourceOptions.forEach(source => {
        const isChecked = source.id === currentSource ? 'checked' : '';
        sourceOptionsHTML += `
            <div class="source-option">
                <input type="radio" name="default-source" id="source-${source.id}" value="${source.id}" ${isChecked}>
                <label for="source-${source.id}">${source.name}</label>
            </div>
        `;
    });

    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-ziyuan" style="font-size: 48px; color: #f39c12;"></i>
                <h3>选择默认源</h3>
            </div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">说明</h4>
                <p style="color: #ddd; margin-bottom: 15px;">请选择您喜欢的默认视频源。搜索时将优先使用此源搜索内容。</p>
                
                <style>
                    .source-options-container {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        margin-bottom: 20px;
                        padding: 15px;
                        border-radius: 8px;
                        background-color: rgba(255, 255, 255, 0.05);
                    }
                    .source-option {
                        display: flex;
                        align-items: center;
                        padding: 8px 10px;
                        border-radius: 6px;
                        background-color: rgba(255, 255, 255, 0.02);
                        transition: background-color 0.2s;
                    }
                    .source-option:hover {
                        background-color: rgba(255, 255, 255, 0.08);
                    }
                    .source-option input[type="radio"] {
                        margin-right: 10px;
                        accent-color: #f39c12;
                    }
                    .source-option label {
                        color: #eee;
                        cursor: pointer;
                    }
                    .save-source-btn {
                        width: 100%;
                        padding: 12px;
                        background-color: #f39c12;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .save-source-btn:hover {
                        background-color: #e67e22;
                    }
                    .save-source-btn:disabled {
                        background-color: #95a5a6;
                        cursor: not-allowed;
                    }
                    .save-result {
                        text-align: center;
                        background-color: rgba(46, 204, 113, 0.2);
                        padding: 10px;
                        border-radius: 6px;
                        margin-top: 15px;
                    }
                </style>
                
                <div class="source-options-container">
                    ${sourceOptionsHTML}
                </div>
                
                <button id="save-source-setting" class="save-source-btn">保存设置</button>
                
                <div id="save-result" class="save-result" style="margin-top: 10px; color: #4cd964; display: none;">
                    <i class="iconfont icon-success"></i> 设置已保存
                </div>
            </div>
        </div>
    `;
    
    showDiscoverContent('选择默认源', content);
    
    // 添加保存按钮事件监听
    setTimeout(() => {
        const saveButton = document.getElementById('save-source-setting');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                const selectedSource = document.querySelector('input[name="default-source"]:checked');
                if (selectedSource) {
                    const sourceId = selectedSource.value;
                    
                    // 显示保存按钮为加载状态
                    saveButton.textContent = '保存中...';
                    saveButton.disabled = true;
                    
                    // 发送请求保存默认源设置
                    fetch(`https://api.sheep.com/sheep/videoPolymerization/api/source/${sourceId}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                // 显示成功消息
                                const saveResult = document.getElementById('save-result');
                                if (saveResult) {
                                    saveResult.style.display = 'block';
                                    setTimeout(() => {
                                        saveResult.style.display = 'none';
                                    }, 3000);
                                }
                                
                                // 更新本地存储中的默认源
                                try {
                                    const userData = localStorage.getItem("sheep_userdata");
                                    if (userData) {
                                        const userDataObj = JSON.parse(userData);
                                        userDataObj.source = sourceId;
                                        localStorage.setItem("sheep_userdata", JSON.stringify(userDataObj));
                                    }
                                } catch (e) {
                                    console.error("更新本地默认源设置失败:", e);
                                }
                                
                                // 更新搜索页面的下拉选择框
                                const sourceSelect = document.getElementById('sourceSelect');
                                if (sourceSelect) {
                                    sourceSelect.value = sourceId;
                                }
                            } else {
                                alert('设置失败: ' + (data.error || '未知错误'));
                            }
                        })
                        .catch(error => {
                            console.error('保存默认源设置失败:', error);
                            alert('保存失败，请稍后重试');
                        })
                        .finally(() => {
                            // 恢复按钮状态
                            saveButton.textContent = '保存设置';
                            saveButton.disabled = false;
                        });
                } else {
                    alert('请选择一个默认源');
                }
            });
        }
        
        // 添加点击整个选项行选择源的功能
        const sourceOptions = document.querySelectorAll('.source-option');
        sourceOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            const label = option.querySelector('label');
            
            // 点击整个选项行时，选中对应的单选按钮
            option.addEventListener('click', function(e) {
                // 如果点击的是单选按钮本身，不需要额外处理
                if (e.target === radio) return;
                
                // 将对应的单选按钮设为选中
                radio.checked = true;
            });
        });
    }, 100);
}