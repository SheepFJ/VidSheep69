// 通用工具函数和环境检测
const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = typeof $httpClient !== "undefined" && typeof $prefs === "undefined";
const isShadowrocket = typeof $rocket !== "undefined";

// 统一存储方法
const storage = {
    get: key => {
        if (isLoon || isSurge || isShadowrocket) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
        return null;
    },
    set: (key, value) => {
        if (isLoon || isSurge || isShadowrocket) return $persistentStore.write(value, key);
        if (isQuanX) return $prefs.setValueForKey(value, key);
        return false;
    }
};

// 统一通知方法
const notify = (title, subtitle, message) => {
    if (isLoon || isSurge || isShadowrocket) {
        $notification.post(title, subtitle, message);
    } else if (isQuanX) {
        $notify(title, subtitle, message);
    }
};

// 统一 HTTP 请求方法
function fetchWithCallback(options, callback) {
    if (isLoon || isSurge || isShadowrocket) {
        // 使用Shadowrocket兼容的方式
        $httpClient.get(options, function(error, response, data) {
            if (error) {
                notify("请求失败", "", JSON.stringify(error));
                callback(error, response, data);
            } else {
                callback(null, response, data);
            }
        });
    } else if (isQuanX) {
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
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': 'PHPSESSID=gssrca2807mddn3ks5vhuraqvr',
            'Connection': 'keep-alive',
            'Sec-Fetch-Mode': 'navigate',
            'Host': 'api.52vmy.cn',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
            'Sec-Fetch-Site': 'same-origin',
            'Referer': 'https://api.52vmy.cn/doc/wl/word/bing/tu.html',
            'Sec-Fetch-Dest': 'document',
            'Accept-Language': 'zh-CN,zh-Hans;q=0.9'
        }
    };

    // 使用回调方式处理异步
    fetchWithCallback(wallpaperRequest, (error, response, data) => {
        if (error) {
            notify("请求失败", "", JSON.stringify(error));
            finishScript();
            return;
        }

        try {
            const obj = JSON.parse(data);
            const imageUrl = obj?.data?.phone_url;

            if (imageUrl) {
                userData.backgroundimage = imageUrl;
                storage.set("sheep_userdata", JSON.stringify(userData));
                notify("壁纸更新成功", "", "背景图片已更新");
            } else {
                notify("解析失败", "", "未找到 data.phone_url");
            }
        } catch (e) {
            notify("错误", "JSON 解析失败", e.message);
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
        response: {
            status: 200,
            headers: { "Content-Type": "text/html" },
            body: html
        }
    });
}