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
        const method = options.method || "GET";
        const fetchOptions = {
            method,
            url: options.url,
            headers: options.headers || {},
            body: options.body || null
        };

        $task.fetch(fetchOptions).then(response => {
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
    "username": "小羊羔子",
    "statusbarcolor": "rgba(0,0,0,0.8)",
    "theme": "true"
};

// 获取用户数据
let userData = storage.get("sheep_userdata");
if (!userData) {
    // 如果不存在，存储默认数据
    storage.set("userdata", JSON.stringify(defaultUserData));
    userData = defaultUserData;
} else {
    // 如果存在，解析JSON数据
    try {
        userData = JSON.parse(userData);
    } catch (e) {
        // 如果JSON解析失败，使用默认数据
        storage.set("userdata", JSON.stringify(defaultUserData));
        userData = defaultUserData;
    }
}

// 获取背景图片和用户名
const backgroundImage = userData.backgroundimage;
const username = userData.username;

// 路由处理
const url = $request.url;

//处理user信息
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
    <!-- 全屏显示 -->
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
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

    <!-- 动态加载区域 -->
    <div id="main-container">

        
    </div>

    <!-- 等待动画加载 -->
    <div id="loading-results"></div>
    <!-- 底部导航 -->
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
</html>`

$done({ status: "HTTP/1.1 200 OK", headers: { "Content-Type": "text/html" }, body: html });