#!name=VidSheep
#!desc=用于PKC插件的视频与文本接口
#!author=@Sheepfj
#!homepage=https://github.com/SheepFJ/QuantumultX
#!icon=https://raw.githubusercontent.com/SheepFJ/VidSheep69/main/icon/sheep.png
#!date=2025-04-01

[URL Rewrite]
^ https: \/\/api\.sheep\.com\/sheep\/videoPolymerization\/ - reject

[Script]
VidSheep = type = http - response, pattern =^ https: \/\/api\.sheep\.com\/sheep\/videoPolymerization\/,script-path=https:/ / raw.githubusercontent.com / SheepFJ / VidSheep69 / refs / heads / main / main / mainlogic.js, requires - body=false, timeout = 10

[MITM]
hostname = % APPEND % api.sheep.com