# @pm
### performance monitor


### 基础耗时数据 Base time consuming data
[谷歌计算的白屏时间] White screen time calculated by Google
[DNS查询耗时] DNS time-consuming
[纯DOM结构解析完成为准计算的白屏时间] The white screen time calculated after the completion of pure DOM structure parsing
[DOMContentLoaded时间] DOMContentLoaded time
[dom结构耗时] Structure of time-consuming
[文档解析完成时间] Document parsing completion time
[HTTP请求耗时] HTTP Request time
[所有资源加载完毕耗时] onLoad time
[重定向耗时] Redirect time
[第一个请求响应后为准计算的白屏时间] The white screen time calculated after the first request response
[TCP连接耗时] TCP Connection time consuming
[TLS连接耗时] TLS Connection time consuming


### 网络信息数据 Network data representation
*（MDN暂不支持IOS，待检测）*
[页面地址] page address
[请求过程中切换网络状态的次数] The number of times the network state is switched during the request
[请求检索城市] Request to retrieve city
[下行速度/带宽，Mb/s] bandwidth
[网络类型:2g,4g] type of network
[请求检索IP] Request to retrieve IP
[估算的往返时间ms] Estimated round-trip time (ms)
[打开/请求数据保护模式] Request data protection mode
[连接类型:wifi/蜂窝] Network connection type


### 用户设备数据 User device data
[设备版本信息] version information
[用户语言] language
[浏览器类型:内核-Opera/IE/Edge/Firefox/Safari/Chrome] browser type.
[设备类型:ios/android/ipad] device type
[端口类型:PC/C] Supported ports


### 使用 Use
pm.init({
    log: true, // 日志log
    port: '/url1', // 基础数据请求接口
    slowerTime: -1, // 筛选请求时长超过slowerTime的资源（ms）
    slowerPort: '/url2', // 筛选资源请求接口
    observe: true, // 持续监听请求时长超过slowerTime的资源
});


### 自定义打点 Custom dot
pm._mark('a') 打点
pm._portMark('url'); 上传


### 输出样例 Sample Output
a: [页面地址] "http://www.xxx.com/list"
b: [谷歌计算的白屏时间] "0.102"
c: [重定向耗时] null
d: [DNS查询耗时] 0
e: [TLS连接耗时] null
f: [TCP连接耗时] 0
g: [HTTP请求耗时] "0.005"
h: [第一个请求响应后为准计算的白屏时间] "0.013"
i: [纯DOM结构解析完成为准计算的白屏时间] "0.698"
j: [dom结构耗时] "0.668"
k: [DOMContentLoaded时间] "0.792"
l: [文档解析完成时间] "5.023"
m: [所有资源加载完毕耗时] "5.053"
n: [下行速度/带宽，Mb/s] 10
o: [连接类型:wifi/蜂窝] undefined
p: [网络类型:2g,4g] "4g"
q: [估算的往返时间ms] 0
r: [打开/请求数据保护模式] false
s: [请求过程中切换网络状态的次数] 0
t: [请求检索IP] "180.168.193.90"
u: [请求检索城市] "shanghai"
v: [端口类型:PC/C] 1
w: [设备类型:ios/android/ipad] 0
x: [浏览器类型:内核-Opera/IE/Edge/Firefox/Safari/Chrome] 0
y: [设备版本信息] "5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
z: [用户语言] "zh-cn"
_s: [过慢资源] [{…}, {…}, {…}, {…}, {
    _n: [资源地址] "http://111.111.11.1"
    _r: [资源请求耗时/s] "0.700"
    _t: [资源请求类型] "xmlhttprequest"
    _c: [是否被缓存命中],
    _y: [资源阻塞时间],
}]
a1: [ServiceWorker连接时间] "0.002"
