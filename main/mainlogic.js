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
        const httpMethod = options.method === "POST" ? $httpClient.post : $httpClient.get;
        httpMethod(options, (error, response, body) => {
            if (error) {
                notify("请求失败", "", JSON.stringify(error));
                callback(error, response, body);
            } else {
                callback(null, response, body);
            }
        });
    } else if (isQuanX) {
        // QuanX 环境
        $task.fetch(options).then(response => {
            callback(null, response, response.body);
        }).catch(error => {
            notify("请求失败", "", JSON.stringify(error));
            callback(error, null, null);
        });
    }
}

// 处理用户信息,初始化页面
const defaultUserData = {
    "backgroundimage": "https://mfiles.alphacoders.com/853/853922.jpg",
    "username": "小羊羔子1009",
    "imageauto": "true", //是否自动更换背景
    "usersettingsimage": "false", //是否用户设置背景
    "statusbarcolor": "rgba(0,0,0,0.8)",
    "theme": "true",
    "initial": "true"
};

// 获取用户数据，初始化信息
let userData = storage.get("sheep_userdata");
if (!userData) {
    storage.set("sheep_userdata", JSON.stringify(defaultUserData));
    userData = defaultUserData;
} else {
    try {
        userData = JSON.parse(userData);
        if (userData.initial === "true" || !userData.initial) {
            userData = defaultUserData;
            userData.initial = "false";
            storage.set("sheep_userdata", JSON.stringify(userData));
        }
    } catch (e) {
        storage.set("sheep_userdata", JSON.stringify(defaultUserData));
        userData = defaultUserData;
    }
}

// 如果开启了自动更新壁纸
if (userData.imageauto === "true") {
    userData.usersettingsimage = "false";
    
    const wallpaperRequest = {
        url: "https://api.52vmy.cn/api/wl/word/bing/tu",
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1'
        }
    };
    
    // 使用回调方式处理异步
    fetchWithCallback(wallpaperRequest, (error, response, body) => {
        if (error) {
            console.log("请求错误：", error);
            notify("壁纸更新失败", "", JSON.stringify(error));
            finishScript();
            return;
        }

        try {
            const responseData = typeof body === 'string' ? JSON.parse(body) : body;
            const imageUrl = responseData?.data?.phone_url;
            
            if (imageUrl) {
                userData.backgroundimage = imageUrl;
                storage.set("sheep_userdata", JSON.stringify(userData));
                notify("壁纸更新成功", "", "背景图片已更新");
            } else {
                notify("壁纸更新失败", "", "未找到图片地址");
            }
        } catch (e) {
            console.log("解析错误：", e);
            notify("壁纸更新失败", "", "数据解析错误：" + e.message);
        }
        finishScript();
    });
} else {
    finishScript();
}

// 完成脚本的函数
function finishScript() {
    const backgroundImage = userData.backgroundimage;
    const username = userData.username;
    const url = $request.url;

    if (url.includes('/videoPolymerization/videoword/userinfo/')) {
        const match = url.match(/\/videoPolymerization\/(userinfo)\/([^\/\?]+)/);
        if (match[2] == "userdata") {
            console.log(11);
        }
    }

    const html = `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        <title>VidSheep</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep69/css/main11.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep69/css/user01.css">
    </head>
    <style>
        body::before {
            background-image: url(${backgroundImage});
        }
    </style>
    <body>
        <div id="main-container"></div>
        <div id="loading-results"></div>
        <footer>
            <div id="bottom-nav">
                <div class="nav-button" id="searchBtn" onclick="showSearch()">搜索</div>
                <div class="nav-button" id="listBtn">最近</div>
                <div class="nav-button" id="listBtn" onclick="showList()">收藏</div>
                <div class="nav-button nav-active" id="profileBtn" onclick="showProfile()">我的</div>
            </div>
        </footer>
    </body>
    <script>
        const username = "${username}";
    </script>   
    <script src="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep69/js/main08.js"></script>
    </html>`;

    $done({ 
        status: "HTTP/1.1 200 OK", 
        headers: { "Content-Type": "text/html" }, 
        body: html 
    });
}