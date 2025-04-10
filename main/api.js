// 通用工具函数和环境检测 - 改进环境检测方式
const isLoon = typeof $loon !== "undefined";
const isQuanX = typeof $task !== "undefined";
const isSurge = typeof $httpClient !== "undefined" && !isLoon && !isQuanX;

// 添加日志函数
function log(message) {
    console.log(`[VidSheep] ${message}`);
    // 如果在开发模式下，也可以通知
    // notify("调试信息", "", message);
}

// 统一存储方法 - 增加错误处理
const storage = {
    get: key => {
        try {
            if (isLoon) {
                return $persistentStore.read(key);
            } else if (isQuanX) {
                return $prefs.valueForKey(key);
            } else if (isSurge) {
                return $persistentStore.read(key);
            }
            return null;
        } catch (e) {
            log(`读取存储失败: ${e.message}`);
            return null;
        }
    },
    set: (key, value) => {
        try {
            if (isLoon) {
                return $persistentStore.write(value, key);
            } else if (isQuanX) {
                return $prefs.setValueForKey(value, key);
            } else if (isSurge) {
                return $persistentStore.write(value, key);
            }
            return false;
        } catch (e) {
            log(`写入存储失败: ${e.message}`);
            return false;
        }
    }
};

// 统一通知方法 - 增加错误处理
const notify = (title, subtitle, message) => {
    try {
        if (isLoon) {
            $notification.post(title, subtitle, message);
        } else if (isQuanX) {
            $notify(title, subtitle, message);
        } else if (isSurge) {
            $notification.post(title, subtitle, message);
        }
    } catch (e) {
        log(`发送通知失败: ${e.message}`);
    }
};

// 统一 HTTP 请求方法 - 改进请求格式
function fetchWithCallback(options, callback) {
    try {
        if (isLoon || isSurge) {
            // 确保options格式正确
            let requestOptions = {
                url: options.url,
                headers: options.headers || {}
            };
            
            // 添加额外选项
            if (options.body) {
                requestOptions.body = options.body;
            }
            
            if (options.method === "POST") {
                $httpClient.post(requestOptions, (error, response, data) => {
                    callback(error, response, data);
                });
            } else {
                $httpClient.get(requestOptions, (error, response, data) => {
                    callback(error, response, data);
                });
            }
        } else if (isQuanX) {
            $task.fetch(options).then(response => {
                callback(null, response, response.body);
            }).catch(error => {
                notify("请求失败", "", JSON.stringify(error));
                callback(error, null, null);
            });
        } else {
            // 不支持的环境
            callback(new Error("不支持的环境"), null, null);
        }
    } catch (e) {
        log(`HTTP请求失败: ${e.message}`);
        callback(e, null, null);
    }
}

// 尝试获取本地存储的 userData
let userData = {};
try {
    const rawData = storage.get("sheep_userdata");
    if (rawData) {
        try {
            userData = JSON.parse(rawData);
        } catch (e) {
            log(`解析userData失败: ${e.message}`);
            userData = {};
        }
    }
} catch (e) {
    log(`获取userData失败: ${e.message}`);
}

// 检查请求对象是否存在
if (typeof $request === "undefined") {
    $done({});
} else {
    const url = $request.url;
    log(`处理请求: ${url}`);

    // 处理 userinfo 相关请求
    if (url.includes('/userinfo/')) {
        try {
            // 处理 username 相关请求
            if (url.includes('/username/')) {
                const match = url.match(/\/videoPolymerization\/userinfo\/username\/([^\/\?]+)/);
                if (match && match[1]) {
                    // url编码转换
                    const username = decodeURIComponent(match[1]);
                    userData.username = username;
                    const saved = storage.set("sheep_userdata", JSON.stringify(userData));
                    log(`保存用户名结果: ${saved ? '成功' : '失败'}`);
                }
                // 以json格式响应
                $done({
                    body: JSON.stringify(userData)
                });
            } else {
                $done({});
            }
        } catch (e) {
            log(`处理userinfo请求失败: ${e.message}`);
            $done({ body: JSON.stringify({ error: e.message }) });
        }
    } else if (url.includes('/videoword/')) {
        handleSearchRequest();
    } else if (url.includes('/videolist/')) {
        handleVideoDetailRequest();
    } else {
        $done({});
    }
}

// 搜索获取数据
function handleSearchRequest() {
    try {
        const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videoword\/([^\/]+)\/\?wd=(.*)/);
        if (!urlMatch) {
            log("无效的请求格式");
            $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
            return;
        }

        const source = urlMatch[1];
        const wd = decodeURIComponent(urlMatch[2]);
        log(`搜索来源: ${source}, 关键词: ${wd}`);

        // 定义不同 source 对应的 API 地址
        const apiSources = {
            "1": "https://caiji.moduapi.cc/api.php/provide/vod?ac=detail&wd=",
            "2": "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/?ac=detail&wd="
        };

        // 获取对应 API 地址
        const baseUrl = apiSources[source];
        if (!baseUrl) {
            log(`不支持的来源: ${source}`);
            $done({ body: JSON.stringify({ error: "不支持的 source" }) });
            return;
        }

        // 构建完整请求 URL
        const requestUrl = baseUrl + encodeURIComponent(wd);
        log(`请求URL: ${requestUrl}`);

        // 使用封装的 fetchWithCallback 方法发送请求
        fetchWithCallback({
            url: requestUrl,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "Connection": "keep-alive"
            }
        }, (error, response, body) => {
            if (error) {
                log(`请求失败: ${JSON.stringify(error)}`);
                notify("请求失败", "", JSON.stringify(error));
                $done({ body: JSON.stringify({ error: "网络错误", detail: error.message || error }) });
                return;
            }

            try {
                if (!body) {
                    throw new Error("响应内容为空");
                }
                
                const json = JSON.parse(body);
                if (!json || !json.list) {
                    throw new Error("返回结果格式不正确");
                }
                
                // 存储视频数据并获取存储的数据对象
                const storedData = storeVodData(json.list || []);
                log(`数据解析成功, 共找到 ${json.list.length} 个结果`);
                notify("数据解析成功", "", `共找到 ${json.list.length} 个结果`);
                
                // 返回存储的数据对象
                $done({ 
                    body: JSON.stringify({ 
                        success: "成功获取数据", 
                        total: json.list.length,
                        data: storedData 
                    }) 
                });
            } catch (e) {
                log(`解析失败: ${e.message}`);
                notify("解析失败", "", e.message);
                $done({ body: JSON.stringify({ error: "解析失败", message: e.message }) });
            }
        });
    } catch (e) {
        log(`处理搜索请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: "处理请求失败", message: e.message }) });
    }
}

// 存储视频数据到本地并返回存储的数据对象
function storeVodData(vodList) {
    let storedData = {};  // 用于存储所有视频数据的对象
    let successCount = 0;

    for (let i = 0; i < vodList.length; i++) {
        try {
            let vod = vodList[i];
            
            if (!vod) {
                log(`第${i}项视频数据为空`);
                continue;
            }

            let vodName = vod.vod_name || "未知标题"; // 标题
            let vodPic = vod.vod_pic || ""; // 图片地址
            let vodContent = vod.vod_content || "无简介"; // 简介
            let vodPlayUrl = vod.vod_play_url || ""; // 播放地址

            // 解析播放地址
            let episodes = [];
            if (vodPlayUrl) {
                let playParts = vodPlayUrl.split("#");  // 根据#符号分隔

                for (let j = 0; j < playParts.length; j++) {
                    if (!playParts[j]) continue;
                    
                    let episodeDetails = playParts[j].split("$");
                    let episodeTitle = episodeDetails[0] || `第${j+1}集`;
                    let episodeUrl = episodeDetails[1] || "";
                    episodes.push(`${episodeTitle}: ${episodeUrl}`);
                }
            }

            // 拼接存储格式
            let storeValue = [vodName, vodPic, vodContent, ...episodes].join(",");

            // 存储到本地
            let key = `sheep_vod_info_${i}`; // 例如：sheep_vod_info_0, sheep_vod_info_1 ...
            let storeResult = storage.set(key, storeValue);
            
            if (storeResult) {
                // 添加到返回对象
                storedData[key] = storeValue;
                successCount++;
            } else {
                log(`存储第${i}项数据失败`);
            }
        } catch (e) {
            log(`处理第${i}项数据失败: ${e.message}`);
        }
    }

    log(`成功存储 ${successCount}/${vodList.length} 条数据`);
    return storedData;  // 返回存储的数据对象
}

// 新增处理影片详情请求的函数
function handleVideoDetailRequest() {
    try {
        const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videolist\/(\d+)/);
        if (!urlMatch) {
            log("无效的详情请求格式");
            $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
            return;
        }

        const index = urlMatch[1];
        const key = `sheep_vod_info_${index}`;
        log(`获取详情, 索引: ${index}, 键: ${key}`);
        
        // 从本地存储中获取对应索引的影片信息
        const storedVodInfo = storage.get(key);
        
        if (!storedVodInfo) {
            log(`未找到对应影片信息, 索引: ${index}`);
            $done({ body: JSON.stringify({ error: "未找到对应影片信息", index: index }) });
            return;
        }
        
        log(`成功获取影片信息, 长度: ${storedVodInfo.length}`);
        // 构建响应对象
        const responseData = {
            success: "剧集信息获取成功",
            total: 1,
            data: {
                [key]: storedVodInfo
            }
        };
        
        $done({ body: JSON.stringify(responseData) });
    } catch (e) {
        log(`处理详情请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: "处理详情请求失败", message: e.message }) });
    }
}
