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
    "username": "小羊羔子1009",
    "imageauto": "true", //是否自动更换背景
    "usersettingsimage": "false", //是否用户设置背景
    "statusbarcolor": "rgba(0,0,0,0.8)",
    "theme": "true",
    "initial" : "true"
};

// 获取用户数据，初始化信息
let userData = storage.get("sheep_userdata");
if (!userData) {
    // 如果不存在，存储默认数据
    storage.set("sheep_userdata", JSON.stringify(defaultUserData));
    userData = defaultUserData;
} else {
    // 如果存在，解析JSON数据
    try {
        userData = JSON.parse(userData);
        // 如多userData.initial为true表示存在key但是未初始化
        if (userData.initial === "true" || !userData.initial) {
            userData = defaultUserData;
            userData.initial = "false";
            storage.set("sheep_userdata", JSON.stringify(userData));
        }
    } catch (e) {
        // 如果JSON解析失败，使用默认数据
        storage.set("sheep_userdata", JSON.stringify(defaultUserData));
        userData = defaultUserData;
    }
}

// 开启自动更新壁纸
if(userData.imageauto === "true"){
    userData.usersettingsimage = "false";
    
    // 自动更换壁纸，发送请求获取每日一图
    const wallpaperRequest = {
        url: "https://api.52vmy.cn/api/wl/word/bing/tu",
        method: "GET",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Host': 'api.52vmy.cn',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1'
        }
    };

    // 使用统一的请求方法
    fetchWithCallback(wallpaperRequest, (error, response, body) => {
        if (error) {
            notify("壁纸更新失败", "", JSON.stringify(error));
            return;
        }

        try {
            console.log("响应内容：", body);
            const responseData = JSON.parse(body);
            console.log("解析后数据：", JSON.stringify(responseData));
            const imageUrl = responseData?.data?.phone_url;
            
            if (imageUrl) {
                userData.backgroundimage = imageUrl;
                storage.set("sheep_userdata", JSON.stringify(userData));
                notify("壁纸更新成功", "", "背景图片已更新");
            } else {
                notify("壁纸更新失败", "", "未找到图片地址");
            }
        } catch (e) {
            notify("壁纸更新失败", "", "数据解析错误：" + e.message);
            console.log("错误详情：", e.message);
        }
    });
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