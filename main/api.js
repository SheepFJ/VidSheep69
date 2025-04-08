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


let userData = storage.get("sheep_userdata");
const url = $request.url;


// 处理 userinfo 相关请求
if (url.includes('/userinfo/')) {
    // 处理 username 相关请求
    if (url.includes('/username/')) {
        const match = url.match(/\/videoPolymerization\/userinfo\/username\/([^\/\?]+)/);
        if (match && match[1]) {
            userData.username = match[1];
            storage.set("sheep_userdata", JSON.stringify(userData));
        }
    }
    // 这里可以添加其他 userinfo 相关的处理逻辑
    // 比如处理 /userinfo/avatar/ 等
    if (url.includes('/avatar/')) {
        const match = url.match(/\/videoPolymerization\/userinfo\/avatar\/([^\/\?]+)/);
        if (match && match[1]) {
            userData.avatar = match[1];
            storage.set("sheep_userdata", JSON.stringify(userData));
        }
    }
}


