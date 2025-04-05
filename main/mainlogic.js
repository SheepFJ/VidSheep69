const html = `<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <!-- 全屏显示 -->
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <title>VidSheep</title>
</head>
<style>
    body::before {
        background-image: url('https://cn.bing.com/th?id=OHR.GaztelugatxeSunset_ZH-CN0553703567_1080x1920.jpg&rf=LaDigue_1080x1920.jpg&pid=HpEdgeAn');

    }
</style>

<body>
    <div id="bottom-nav">
        <div>搜索</div>
        <div>最近</div>
        <div>我的</div>
    </div>
</body>

</html>`

$done({ status: "HTTP/1.1 200 OK", headers: { "Content-Type": "text/html" }, body: html });