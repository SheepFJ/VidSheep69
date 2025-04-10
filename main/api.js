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

// 添加处理videolist请求的条件
if (url.includes('/videolist/')) {
    handleVideoDetailRequest();
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
            // 返回存储的数据对象
            $done({ body: JSON.stringify({ 
                success: "成功获取数据", 
                total: json.list ? json.list.length : 0,
                data: storedData 
            }) });
        } catch (e) {
            notify("解析失败", "", e.message);
            $done({ body: JSON.stringify({ error: "解析失败" }) });
        }
    });
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

// 新增处理影片详情请求的函数
function handleVideoDetailRequest() {
    const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videolist\/(\d+)/);
    if (!urlMatch) {
        $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
        return;
    }

    const index = urlMatch[1];
    const key = `sheep_vod_info_${index}`;
    
    // 从本地存储中获取对应索引的影片信息
    const storedVodInfo = storage.get(key);
    
    if (!storedVodInfo) {
        $done({ body: JSON.stringify({ error: "未找到对应影片信息", index: index }) });
        return;
    }
    
    // 构建响应对象
    const responseData = {
        success: "剧集信息获取成功",
        total: 1,
        data: {
            [key]: storedVodInfo
        }
    };
    
    $done({ body: JSON.stringify(responseData) });
}
