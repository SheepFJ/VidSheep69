// 通用工具函数和环境检测 - 采用与mainlogic.js相同的检测方式
const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = !isLoon && !isQuanX; // 其他环境按Surge处理

// 添加日志函数
function log(message) {
    console.log(`[VidSheep] ${message}`);
}

// 统一存储方法 - 复用mainlogic.js的方式
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

// 统一通知方法 - 复用mainlogic.js的方式
const notify = (title, subtitle, message) => {
    if (isLoon || isSurge) {
        $notification.post(title, subtitle, message);
    } else if (isQuanX) {
        $notify(title, subtitle, message);
    }
};

// 统一 HTTP 请求方法 - 复用mainlogic.js的方式
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
let userData = {};
try {
    const rawData = storage.get("sheep_userdata");
    userData = rawData ? JSON.parse(rawData) : {};
    
    // 确保historical_storage字段存在
    if (!userData.historical_storage) {
        userData.historical_storage = {
            current_index: 0,
            max_storage: 20
        };
        storage.set("sheep_userdata", JSON.stringify(userData));
    }
} catch (e) {
    log(`解析userData失败: ${e.message}`);
    userData = {
        historical_storage: {
            current_index: 0,
            max_storage: 20
        }
    };
    storage.set("sheep_userdata", JSON.stringify(userData));
}

// 检查请求URL并处理
const url = $request.url;
log(`处理请求: ${url}`);

// 处理 userinfo 相关请求
if (url.includes('/userinfo/')) {
    try {
        // 处理 username 相关请求
        if (url.includes('/username/')) {
            // 修改用户名
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

        // 使用封装的 fetchWithCallback 方法发送请求 - 简化请求头
        fetchWithCallback({
            url: requestUrl,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
                "Accept": "application/json",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9"
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
                
                // 解析JSON响应
                const json = JSON.parse(body);
                if (!json || !json.list) {
                    throw new Error("返回结果格式不正确");
                }
                
                // 存储视频数据并获取存储的数据对象
                const storedResult = storeVodData(json.list || []);
                log(`数据解析成功, 共找到 ${json.list.length} 个结果`);
                notify("数据解析成功", "", `共找到 ${json.list.length} 个结果`);
                
                // 返回存储的数据对象
                $done({ 
                    body: JSON.stringify({ 
                        success: "成功获取数据", 
                        total: json.list.length,
                        data: storedResult.data,
                        index_info: storedResult.index_info
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
    let indexMapping = {}; // 添加索引映射对象
    let startIndex = null; // 记录本次存储的起始索引

    // 获取当前存储索引
    let currentIndex = userData.historical_storage.current_index || 0;
    const maxStorage = userData.historical_storage.max_storage || 20;
    
    // 记录本次存储起始的索引值
    startIndex = currentIndex;

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

            // 使用循环索引存储，当超过maxStorage时从0开始重新存储
            let key = `sheep_vod_info_${currentIndex}`;
            
            // 添加索引映射 - 列表位置i映射到存储索引currentIndex
            indexMapping[i] = currentIndex;
            
            // 更新循环索引
            currentIndex = (currentIndex + 1) % maxStorage;
            
            // 更新存储索引
            userData.historical_storage.current_index = currentIndex;
            storage.set("sheep_userdata", JSON.stringify(userData));
            
            // 存储到本地
            let storeResult = storage.set(key, storeValue);
            
            if (storeResult) {
                // 添加到返回对象
                storedData[key] = storeValue;
                successCount++;
            } else {
                log(`存储第${i}项数据失败，键：${key}`);
            }
        } catch (e) {
            log(`处理第${i}项数据失败: ${e.message}`);
        }
    }

    // 存储索引映射信息到localStorage
    storage.set("sheep_index_mapping", JSON.stringify({
        startIndex: startIndex,
        mapping: indexMapping,
        timestamp: new Date().getTime()
    }));

    log(`成功存储 ${successCount}/${vodList.length} 条数据，当前索引：${userData.historical_storage.current_index}`);
    log(`存储索引映射：起始索引=${startIndex}, 映射关系=${JSON.stringify(indexMapping)}`);
    
    // 返回存储数据对象，并添加映射信息
    return {
        data: storedData,
        index_info: {
            start_index: startIndex,
            mapping: indexMapping
        }
    };
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

        // 获取请求的视频索引（即前端列表中的位置）
        const listIndex = parseInt(urlMatch[1]);
        log(`获取详情, 列表索引: ${listIndex}`);
        
        // 尝试从索引映射中查找实际存储键
        let actualKey = null;
        const mappingInfo = storage.get("sheep_index_mapping");
        
        if (mappingInfo) {
            try {
                const mappingData = JSON.parse(mappingInfo);
                
                // 检查映射数据中是否有这个索引的映射
                if (mappingData.mapping && mappingData.mapping[listIndex] !== undefined) {
                    // 找到实际存储的索引
                    const storageIndex = mappingData.mapping[listIndex];
                    actualKey = `sheep_vod_info_${storageIndex}`;
                    log(`从映射找到实际存储键: ${actualKey}, 原始列表索引: ${listIndex}`);
                }
            } catch (e) {
                log(`解析索引映射数据失败: ${e.message}`);
            }
        }
        
        // 如果没有找到映射，使用直接索引
        if (!actualKey) {
            actualKey = `sheep_vod_info_${listIndex}`;
            log(`无映射数据，直接使用列表索引作为存储键: ${actualKey}`);
        }
        
        // 从本地存储中获取对应索引的影片信息
        const storedVodInfo = storage.get(actualKey);
        
        if (!storedVodInfo) {
            log(`未找到影片信息, 键: ${actualKey}`);
            
            // 尝试搜索所有可能的索引
            const maxStorage = userData.historical_storage?.max_storage || 20;
            let foundInfo = null;
            let foundKey = null;
            
            // 遍历所有可能的索引查找数据
            for (let i = 0; i < maxStorage; i++) {
                const tempKey = `sheep_vod_info_${i}`;
                const tempInfo = storage.get(tempKey);
                if (tempInfo) {
                    // 存储最后一个找到的信息作为备用
                    foundInfo = tempInfo;
                    foundKey = tempKey;
                }
            }
            
            // 如果找到了任何信息，使用最后找到的作为响应
            if (foundInfo) {
                log(`未找到键${actualKey}，但找到备选数据，键: ${foundKey}`);
                const responseData = {
                    success: "剧集信息获取成功(备选)",
                    total: 1,
                    data: {
                        [foundKey]: foundInfo
                    },
                    actual_index: foundKey.replace('sheep_vod_info_', '')
                };
                $done({ body: JSON.stringify(responseData) });
                return;
            }
            
            // 如果完全没有找到数据，返回错误
            $done({ body: JSON.stringify({ error: "未找到任何影片信息", request_index: listIndex }) });
            return;
        }
        
        log(`成功获取影片信息, 键: ${actualKey}, 长度: ${storedVodInfo.length}`);
        // 构建响应对象
        const responseData = {
            success: "剧集信息获取成功",
            total: 1,
            data: {
                [actualKey]: storedVodInfo
            },
            actual_index: actualKey.replace('sheep_vod_info_', '')
        };
        
        $done({ body: JSON.stringify(responseData) });
    } catch (e) {
        log(`处理详情请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: "处理详情请求失败", message: e.message }) });
    }
}
