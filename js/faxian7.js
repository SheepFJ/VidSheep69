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
        // { id: 'my-collection', title: '我的收藏', icon: 'icon-shoucang', handler: showMyCollection },

        // 修改壁纸
        { id: 'change-wallpaper', title: '修改壁纸', icon: 'icon-bi', handler: showChangeWallpaper },
        
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
                
                <div style="margin-top: 15px;">
                    <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="color: #ddd; font-size: 14px;">壁纸链接：</label>
                            <input id="wallpaper-url" type="text" placeholder="请输入壁纸图片URL" style="padding: 10px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff;">
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                                <label style="color: #ddd; font-size: 14px;">亮度调整 (0-1)：</label>
                                <div style="display: flex; align-items: center;">
                                    <button id="brightness-down" style="width: 36px; height: 36px; border-radius: 4px 0 0 4px; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; cursor: pointer;">-</button>
                                    <input id="brightness-value" type="text" value="0.5" style="flex: 1; text-align: center; padding: 8px 5px; border-left: none; border-right: none; background-color: rgba(255, 255, 255, 0.1); border-top: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2); color: #fff;">
                                    <button id="brightness-up" style="width: 36px; height: 36px; border-radius: 0 4px 4px 0; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; cursor: pointer;">+</button>
                                </div>
                            </div>
                            
                            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                                <label style="color: #ddd; font-size: 14px;">模糊度 (0-10)：</label>
                                <div style="display: flex; align-items: center;">
                                    <button id="blur-down" style="width: 36px; height: 36px; border-radius: 4px 0 0 4px; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; cursor: pointer;">-</button>
                                    <input id="blur-value" type="text" value="2" style="flex: 1; text-align: center; padding: 8px 5px; border-left: none; border-right: none; background-color: rgba(255, 255, 255, 0.1); border-top: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2); color: #fff;">
                                    <button id="blur-up" style="width: 36px; height: 36px; border-radius: 0 4px 4px 0; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; cursor: pointer;">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <button id="save-wallpaper" style="margin-top: 10px; padding: 12px; border-radius: 8px; background-color: #f39c12; border: none; color: #fff; font-weight: bold; cursor: pointer;">保存设置</button>
                    </div>
                </div>
            </div>
            
            <div class="about-us-update-info" style="margin-top: 20px;">
                <h4 class="update-title">精选壁纸</h4>
                <p style="color: #ddd; margin-bottom: 15px;">点击下方壁纸即可应用</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px;">
                    <div class="preset-wallpaper" data-url="https://mfiles.alphacoders.com/853/853922.jpg" data-brightness="0.5" data-blur="2" style="position: relative;">
                        <img src="https://mfiles.alphacoders.com/853/853922.jpg" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: rgba(0,0,0,0.6); border-radius: 0 0 8px 8px; font-size: 12px; color: #fff; text-align: center;">默认壁纸</div>
                    </div>
                    <div class="preset-wallpaper" data-url="https://images.alphacoders.com/128/1282436.png" data-brightness="0.6" data-blur="3" style="position: relative;">
                        <img src="https://images.alphacoders.com/128/1282436.png" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: rgba(0,0,0,0.6); border-radius: 0 0 8px 8px; font-size: 12px; color: #fff; text-align: center;">动漫风格</div>
                    </div>
                    <div class="preset-wallpaper" data-url="https://images.alphacoders.com/130/1308797.png" data-brightness="0.5" data-blur="4" style="position: relative;">
                        <img src="https://images.alphacoders.com/130/1308797.png" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: rgba(0,0,0,0.6); border-radius: 0 0 8px 8px; font-size: 12px; color: #fff; text-align: center;">城市夜景</div>
                    </div>
                    <div class="preset-wallpaper" data-url="https://images.alphacoders.com/130/1307284.png" data-brightness="0.4" data-blur="1" style="position: relative;">
                        <img src="https://images.alphacoders.com/130/1307284.png" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: rgba(0,0,0,0.6); border-radius: 0 0 8px 8px; font-size: 12px; color: #fff; text-align: center;">科幻景观</div>
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
        
        // 预设壁纸点击事件
        const presetWallpapers = document.querySelectorAll('.preset-wallpaper');
        presetWallpapers.forEach(item => {
            item.addEventListener('click', () => {
                const url = item.getAttribute('data-url');
                const brightness = item.getAttribute('data-brightness');
                const blur = item.getAttribute('data-blur');
                
                // 预览效果（设置预览的背景样式）
                updateWallpaperPreview(url);
                
                // 更新输入框的值
                document.getElementById('wallpaper-url').value = url;
                document.getElementById('brightness-value').value = brightness;
                document.getElementById('blur-value').value = blur;
                
                // 可选：直接保存设置
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