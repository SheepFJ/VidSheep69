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
        { id: 'hot-topics', title: '热门话题', icon: 'icon-remen', handler: showHotTopics },
        { id: 'recommend', title: '推荐影视', icon: 'icon-tuijian', handler: showRecommendedVideos },
        { id: 'rank-list', title: '排行榜', icon: 'icon-paihangbang', handler: showRankList },
        { id: 'categories', title: '分类浏览', icon: 'icon-fenlei', handler: showCategories },
        { id: 'trending', title: '近期热播', icon: 'icon-hot', handler: showTrending },
        { id: 'new-release', title: '最新上线', icon: 'icon-new', handler: showNewReleases },
        { id: 'feedback', title: '反馈建议', icon: 'icon-yijianfankui', handler: showFeedback },
        { id: 'about-us', title: '关于我们', icon: 'icon-guanyu', handler: showAboutUs }
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
        <div class="discover-content-header">
            <button class="discover-back-button">
                <i class="iconfont icon-fanhui"></i>
            </button>
            <h2 class="discover-content-title">${title}</h2>
        </div>
        <div class="discover-content-body">
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

// 热门话题
function showHotTopics() {
    const content = `
        <div class="discover-loading">
            <div class="loading-animation"></div>
            <div class="loading-text">正在加载热门话题...</div>
        </div>
    `;
    
    showDiscoverContent('热门话题', content);
    
    // 模拟加载数据
    setTimeout(() => {
        const discoverContentBody = document.querySelector('.discover-content-body');
        if (discoverContentBody) {
            discoverContentBody.innerHTML = `
                <div class="hot-topics-list">
                    <div class="hot-topic-item">
                        <div class="hot-topic-rank">1</div>
                        <div class="hot-topic-info">
                            <div class="hot-topic-title">流浪地球3即将上映</div>
                            <div class="hot-topic-desc">科幻大片续集引发热议</div>
                        </div>
                    </div>
                    <div class="hot-topic-item">
                        <div class="hot-topic-rank">2</div>
                        <div class="hot-topic-info">
                            <div class="hot-topic-title">新国漫崛起</div>
                            <div class="hot-topic-desc">国产动画质量大幅提升</div>
                        </div>
                    </div>
                    <div class="hot-topic-item">
                        <div class="hot-topic-rank">3</div>
                        <div class="hot-topic-info">
                            <div class="hot-topic-title">经典电影重映</div>
                            <div class="hot-topic-desc">老片新看，感受不一样的魅力</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 1000);
}

// 推荐影视
function showRecommendedVideos() {
    const content = `
        <div class="discover-loading">
            <div class="loading-animation"></div>
            <div class="loading-text">正在加载推荐影视...</div>
        </div>
    `;
    
    showDiscoverContent('推荐影视', content);
    
    // 模拟加载数据
    setTimeout(() => {
        const discoverContentBody = document.querySelector('.discover-content-body');
        if (discoverContentBody) {
            discoverContentBody.innerHTML = `
                <div class="recommend-grid">
                    <div class="recommend-item">
                        <div class="recommend-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="recommend-title">影片标题1</div>
                    </div>
                    <div class="recommend-item">
                        <div class="recommend-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="recommend-title">影片标题2</div>
                    </div>
                    <div class="recommend-item">
                        <div class="recommend-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="recommend-title">影片标题3</div>
                    </div>
                    <div class="recommend-item">
                        <div class="recommend-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="recommend-title">影片标题4</div>
                    </div>
                </div>
            `;
        }
    }, 1000);
}

// 排行榜
function showRankList() {
    const content = `
        <div class="rank-tabs">
            <div class="rank-tab active" data-type="week">周榜</div>
            <div class="rank-tab" data-type="month">月榜</div>
            <div class="rank-tab" data-type="all">总榜</div>
        </div>
        <div class="rank-content">
            <div class="discover-loading">
                <div class="loading-animation"></div>
                <div class="loading-text">正在加载排行榜...</div>
            </div>
        </div>
    `;
    
    showDiscoverContent('排行榜', content);
    
    // 模拟加载数据
    setTimeout(() => {
        const rankContent = document.querySelector('.rank-content');
        if (rankContent) {
            rankContent.innerHTML = `
                <div class="rank-list">
                    <div class="rank-item">
                        <div class="rank-num">1</div>
                        <div class="rank-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="rank-info">
                            <div class="rank-title">影片标题1</div>
                            <div class="rank-desc">类型：动作 / 冒险</div>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-num">2</div>
                        <div class="rank-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="rank-info">
                            <div class="rank-title">影片标题2</div>
                            <div class="rank-desc">类型：科幻 / 惊悚</div>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-num">3</div>
                        <div class="rank-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="rank-info">
                            <div class="rank-title">影片标题3</div>
                            <div class="rank-desc">类型：剧情 / 爱情</div>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加排行榜标签切换事件
            document.querySelectorAll('.rank-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 这里可以根据不同标签加载不同数据
                    const type = this.getAttribute('data-type');
                    // 模拟加载中
                    rankContent.innerHTML = `
                        <div class="discover-loading">
                            <div class="loading-animation"></div>
                            <div class="loading-text">正在加载${type === 'week' ? '周榜' : type === 'month' ? '月榜' : '总榜'}...</div>
                        </div>
                    `;
                    
                    // 模拟加载完成
                    setTimeout(() => {
                        rankContent.innerHTML = `
                            <div class="rank-list">
                                <div class="rank-item">
                                    <div class="rank-num">1</div>
                                    <div class="rank-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                                    <div class="rank-info">
                                        <div class="rank-title">${type}影片标题1</div>
                                        <div class="rank-desc">类型：动作 / 冒险</div>
                                    </div>
                                </div>
                                <div class="rank-item">
                                    <div class="rank-num">2</div>
                                    <div class="rank-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                                    <div class="rank-info">
                                        <div class="rank-title">${type}影片标题2</div>
                                        <div class="rank-desc">类型：科幻 / 惊悚</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }, 500);
                });
            });
        }
    }, 1000);
}

// 分类浏览
function showCategories() {
    const content = `
        <div class="categories-grid">
            <div class="category-item" data-category="动作">
                <i class="iconfont icon-dongzuo"></i>
                <span>动作</span>
            </div>
            <div class="category-item" data-category="喜剧">
                <i class="iconfont icon-xiju"></i>
                <span>喜剧</span>
            </div>
            <div class="category-item" data-category="爱情">
                <i class="iconfont icon-aiqing"></i>
                <span>爱情</span>
            </div>
            <div class="category-item" data-category="科幻">
                <i class="iconfont icon-kehuan"></i>
                <span>科幻</span>
            </div>
            <div class="category-item" data-category="恐怖">
                <i class="iconfont icon-kongbu"></i>
                <span>恐怖</span>
            </div>
            <div class="category-item" data-category="动画">
                <i class="iconfont icon-donghua"></i>
                <span>动画</span>
            </div>
            <div class="category-item" data-category="剧情">
                <i class="iconfont icon-juqing"></i>
                <span>剧情</span>
            </div>
            <div class="category-item" data-category="纪录片">
                <i class="iconfont icon-jilupian"></i>
                <span>纪录片</span>
            </div>
        </div>
    `;
    
    showDiscoverContent('分类浏览', content);
    
    // 添加分类点击事件
    setTimeout(() => {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // 显示该分类的影视列表
                showCategoryContent(category);
            });
        });
    }, 100);
}

// 显示特定分类的内容
function showCategoryContent(category) {
    const content = `
        <div class="discover-loading">
            <div class="loading-animation"></div>
            <div class="loading-text">正在加载${category}分类...</div>
        </div>
    `;
    
    showDiscoverContent(`${category}`, content);
    
    // 模拟加载数据
    setTimeout(() => {
        const discoverContentBody = document.querySelector('.discover-content-body');
        if (discoverContentBody) {
            discoverContentBody.innerHTML = `
                <div class="category-result">
                    <div class="category-items">
                        <div class="category-video-item">
                            <div class="category-video-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                            <div class="category-video-title">${category}影片1</div>
                        </div>
                        <div class="category-video-item">
                            <div class="category-video-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                            <div class="category-video-title">${category}影片2</div>
                        </div>
                        <div class="category-video-item">
                            <div class="category-video-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                            <div class="category-video-title">${category}影片3</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 1000);
}

// 近期热播
function showTrending() {
    const content = `
        <div class="discover-loading">
            <div class="loading-animation"></div>
            <div class="loading-text">正在加载近期热播...</div>
        </div>
    `;
    
    showDiscoverContent('近期热播', content);
    
    // 模拟加载数据
    setTimeout(() => {
        const discoverContentBody = document.querySelector('.discover-content-body');
        if (discoverContentBody) {
            discoverContentBody.innerHTML = `
                <div class="trending-list">
                    <div class="trending-item">
                        <div class="trending-rank">1</div>
                        <div class="trending-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="trending-info">
                            <div class="trending-title">热播影片1</div>
                            <div class="trending-desc">今日播放量: 10.2万</div>
                        </div>
                    </div>
                    <div class="trending-item">
                        <div class="trending-rank">2</div>
                        <div class="trending-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="trending-info">
                            <div class="trending-title">热播影片2</div>
                            <div class="trending-desc">今日播放量: 9.8万</div>
                        </div>
                    </div>
                    <div class="trending-item">
                        <div class="trending-rank">3</div>
                        <div class="trending-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="trending-info">
                            <div class="trending-title">热播影片3</div>
                            <div class="trending-desc">今日播放量: 7.5万</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 1000);
}

// 最新上线
function showNewReleases() {
    const content = `
        <div class="discover-loading">
            <div class="loading-animation"></div>
            <div class="loading-text">正在加载最新上线...</div>
        </div>
    `;
    
    showDiscoverContent('最新上线', content);
    
    // 模拟加载数据
    setTimeout(() => {
        const discoverContentBody = document.querySelector('.discover-content-body');
        if (discoverContentBody) {
            discoverContentBody.innerHTML = `
                <div class="new-releases-grid">
                    <div class="new-release-item">
                        <div class="new-release-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="new-release-info">
                            <div class="new-release-title">新上线影片1</div>
                            <div class="new-release-date">上线时间: 今天</div>
                        </div>
                    </div>
                    <div class="new-release-item">
                        <div class="new-release-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="new-release-info">
                            <div class="new-release-title">新上线影片2</div>
                            <div class="new-release-date">上线时间: 昨天</div>
                        </div>
                    </div>
                    <div class="new-release-item">
                        <div class="new-release-image" style="background-image: url('https://via.placeholder.com/150x200')"></div>
                        <div class="new-release-info">
                            <div class="new-release-title">新上线影片3</div>
                            <div class="new-release-date">上线时间: 前天</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 1000);
}

// 反馈建议
function showFeedback() {
    const content = `
        <div class="feedback-form">
            <div class="feedback-field">
                <label for="feedback-type">反馈类型</label>
                <select id="feedback-type" class="feedback-input">
                    <option value="bug">问题反馈</option>
                    <option value="suggestion">功能建议</option>
                    <option value="content">内容反馈</option>
                </select>
            </div>
            <div class="feedback-field">
                <label for="feedback-content">反馈内容</label>
                <textarea id="feedback-content" class="feedback-textarea" placeholder="请详细描述您的反馈或建议..."></textarea>
            </div>
            <div class="feedback-field">
                <label for="feedback-contact">联系方式 (选填)</label>
                <input type="text" id="feedback-contact" class="feedback-input" placeholder="请留下您的联系方式，方便我们回复">
            </div>
            <button class="feedback-submit">提交反馈</button>
        </div>
    `;
    
    showDiscoverContent('反馈建议', content);
    
    // 添加提交事件
    setTimeout(() => {
        const submitButton = document.querySelector('.feedback-submit');
        if (submitButton) {
            submitButton.addEventListener('click', function() {
                const type = document.getElementById('feedback-type')?.value;
                const content = document.getElementById('feedback-content')?.value;
                
                if (!content || content.trim() === '') {
                    alert('请填写反馈内容');
                    return;
                }
                
                // 显示提交中
                this.textContent = '提交中...';
                this.disabled = true;
                
                // 模拟提交
                setTimeout(() => {
                    const discoverContentBody = document.querySelector('.discover-content-body');
                    if (discoverContentBody) {
                        discoverContentBody.innerHTML = `
                            <div class="feedback-success">
                                <i class="iconfont icon-chenggong"></i>
                                <h3>反馈提交成功！</h3>
                                <p>感谢您的反馈，我们会认真处理您的建议。</p>
                                <button class="feedback-back-button">返回</button>
                            </div>
                        `;
                        
                        // 添加返回按钮事件
                        const backButton = document.querySelector('.feedback-back-button');
                        if (backButton) {
                            backButton.addEventListener('click', backToDiscoverList);
                        }
                    }
                }, 1500);
            });
        }
    }, 100);
}

// 关于我们
function showAboutUs() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-shipin" style="font-size: 48px; color: #f39c12;"></i>
                <h3>VidSheep</h3>
            </div>
            <div class="about-us-version">版本: 1.0.0</div>
            <div class="about-us-desc">
                <p>VidSheep 是一款集影视搜索、观看、收藏于一体的综合应用。</p>
                <p>我们致力于为用户提供最优质的观影体验和最丰富的影视资源。</p>
            </div>
            <div class="about-us-links">
                <div class="about-us-link">
                    <i class="iconfont icon-github"></i>
                    <span>GitHub: SheepFJ</span>
                </div>
                <div class="about-us-link">
                    <i class="iconfont icon-telegram"></i>
                    <span>Telegram: sheep_007_xiaoyang</span>
                </div>
            </div>
            <div class="about-us-copyright">
                <p>© 2025 VidSheep All Rights Reserved.</p>
            </div>
        </div>
    `;
    
    showDiscoverContent('关于我们', content);
}