// 通用工具函数和环境检测
const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = !isLoon && !isQuanX; // 其他环境按Surge处理

// 统一存储方法
const storage = {
    get: key => {
        if (isLoon || isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
        return null;
    },
    set: (key, value) => {
        if (isLoon || isSurge) return $persistentStore.write(value, key);
        if (isQuanX) return $prefs.setValueForKey(value, key);
        return false;
    }
};

// 统一通知方法
const notify = (title, subtitle, message) => {
    if (isLoon || isSurge) {
        $notification.post(title, subtitle, message);
    } else if (isQuanX) {
        $notify(title, subtitle, message);
    }
};

// 统一 HTTP 请求方法
function fetchWithCallback(options, callback) {
    if (isLoon || isSurge) {
        if (options.method === "POST") {
            $httpClient.post(options, callback);
        } else {
            $httpClient.get(options, callback);
        }
    } else if (isQuanX) {
        $task.fetch(options).then(response => {
            callback(null, response, response.body);
        }).catch(error => {
            notify("请求失败", "", JSON.stringify(error));
            callback(error, null, null);
        });
    }
}


// 获取本地存储的 userData，确保是对象
let rawData = storage.get("sheep_userdata");
let userData = {};

// 尝试解析 JSON，如果失败就使用空对象
try {
    userData = rawData ? JSON.parse(rawData) : {};
} catch (e) {
    userData = {};
}

const url = $request.url;
// 处理 userinfo 相关请求
if (url.includes('/userinfo/')) {
    // 处理 username 相关请求
    if (url.includes('/username/')) {
        const match = url.match(/\/videoPolymerization\/userinfo\/username\/([^\/\?]+)/);
        if (match && match[1]) {
            // url编码转换
            const username = decodeURIComponent(match[1]);
            userData.username = username;
            storage.set("sheep_userdata", JSON.stringify(userData));
        }
        // 以json格式响应
        $done({
            body: JSON.stringify(userData)
        });
    }
}


if (url.includes('/videoword/')) {
    handleSearchRequest();
}


// 搜索获取数据
function handleSearchRequest() {
    const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videoword\/([^\/]+)\/\?wd=(.*)/);
    if (!urlMatch) {
        $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
        return;
    }

    const source = urlMatch[1];
    const wd = decodeURIComponent(urlMatch[2]);

    // 定义不同 source 对应的 API 地址
    const apiSources = {
        "1": "https://caiji.moduapi.cc/api.php/provide/vod?ac=detail&wd=",
        "2": "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/?ac=detail&wd="
    };

    // 获取对应 API 地址
    const baseUrl = apiSources[source];
    if (!baseUrl) {
        $done({ body: JSON.stringify({ error: "不支持的 source" }) });
        return;
    }

    // 构建完整请求 URL
    const requestUrl = baseUrl + encodeURIComponent(wd);

    // 使用封装的 fetchWithCallback 方法发送请求
    fetchWithCallback({
        url: requestUrl,
        method: "GET",
        headers: {
            "Sec-Fetch-Dest": "empty",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Priority": "u=3, i",
            "Sec-Fetch-Site": "cross-site",
            "Origin": "https://movies.disney.com",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://movies.disney.com/",
            "Host": new URL(requestUrl).host,
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Accept": "*/*"
        }
    }, (error, response, body) => {
        if (error) {
            notify("请求失败", "", JSON.stringify(error));
            $done({ body: JSON.stringify({ error: "网络错误", detail: error }) });
            return;
        }

        try {
            const json = JSON.parse(body);
            
            // 存储视频数据并获取存储的数据对象
            const storedData = storeVodData(json.list || []);
            notify("数据解析成功", "", `共找到 ${json.list ? json.list.length : 0} 个结果`);
            
            // 生成HTML内容而不是返回JSON
            if (!json.list || json.list.length === 0) {
                // 没有结果时返回提示
                $done({ body: '<div class="no-results">未找到相关影视，尝试切换源~</div>' });
            } else {
                // 有结果时生成HTML内容
                let htmlContent = generateResultsHtml(storedData);
                $done({ body: htmlContent });
            }
        } catch (e) {
            notify("解析失败", "", e.message);
            $done({ body: '<div class="no-results">搜索失败，请稍后重试</div>' });
        }
    });
}

// 生成搜索结果的HTML内容
function generateResultsHtml(storedData) {
    let html = '<div class="search-results-container" style="width: 100%; max-width: 100vw;">';
    
    // 计数器用于每三个项目创建一个新行
    let count = 0;
    let rowHtml = '';
    
    // 遍历所有存储的数据
    for (let key in storedData) {
        // 解析存储的数据
        const parts = storedData[key].split(',');
        const vodName = parts[0];
        const vodPic = parts[1];
        const vodContent = parts[2];
        const episodes = parts.slice(3);
        
        // 每三个项目创建一个新行
        if (count % 3 === 0) {
            // 如果有上一行的内容，先关闭它
            if (rowHtml) {
                html += rowHtml + '</div>';
            }
            // 开始新行
            rowHtml = '<div class="movie-row" style="width: 100%; display: flex; justify-content: space-between; margin-bottom: 12px; padding: 0 5px; box-sizing: border-box;">';
        }
        
        // 电影项目HTML
        rowHtml += `
            <div class="movie-item" data-key="${key}" data-name="${vodName}" data-pic="${vodPic}" data-content="${vodContent}" data-episodes="${episodes.join('|')}" style="width: 30%; margin: 0 1.5%; background: rgba(40, 40, 40, 0.6); border-radius: 8px; overflow: hidden; position: relative;">
                <img src="${vodPic}" alt="${vodName}" style="width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block;" onerror="this.src='https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep69/img/no-image.jpg'" loading="lazy">
                <span class="movie-title" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; font-size: 13px; color: #fff; text-align: center; min-height: 36px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; background: rgba(0, 0, 0, 0.7);">${vodName}</span>
            </div>
        `;
        
        count++;
    }
    
    // 添加最后一行
    if (rowHtml) {
        html += rowHtml + '</div>';
    }
    
    html += '</div>';
    return html;
}

// 存储视频数据到本地并返回存储的数据对象
function storeVodData(vodList) {
    let storedData = {};  // 用于存储所有视频数据的对象

    for (let i = 0; i < vodList.length; i++) {
        let vod = vodList[i];

        let vodName = vod.vod_name; // 标题
        let vodPic = vod.vod_pic; // 图片地址
        let vodContent = vod.vod_content; // 简介
        let vodPlayUrl = vod.vod_play_url; // 播放地址

        // 解析播放地址
        let episodes = [];
        let playParts = vodPlayUrl.split("#");  // 根据#符号分隔

        for (let j = 0; j < playParts.length; j++) {
            let episodeDetails = playParts[j].split("$");
            let episodeTitle = episodeDetails[0];
            let episodeUrl = episodeDetails[1] || "";
            episodes.push(`${episodeTitle}: ${episodeUrl}`);
        }

        // 拼接存储格式
        let storeValue = [vodName, vodPic, vodContent, ...episodes].join(",");

        // 存储到本地
        let key = `sheep_vod_info_${i}`; // 例如：sheep_vod_info_0, sheep_vod_info_1 ...
        storage.set(key, storeValue);
        
        // 添加到返回对象
        storedData[key] = storeValue;
    }

    return storedData;  // 返回存储的数据对象
}
