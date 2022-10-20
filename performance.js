/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { track } from "./tracker";

/**
 * @title performance monitor
 * @des 性能监控器
 * @author Mason
 * @copyRight https://www.w3.org/TR/navigation-timing-2/
 * @copyRight https://developer.mozilla.org/zh-CN/docs/Web/API/Performance
 * @returns { Performance.init() 👇👇👇 } new Performance()
 *
 *
 * @method init(_e) 初始化入参
 * @this {Boolean} _e.log 默认false，是否打印日志
 * @this {Number} _e.slowerTime 默认0，筛选请求时长超过slowerTime的资源（ms）
 * @this {String} _e.port 默认''，基础数据请求接口
 * @this {String} _e.slowerPort 默认''，筛选资源请求接口
 * @this {Boolean} _e.observe 默认false，持续监听请求时长超过slowerTime的资源
 *
 * @exmaple 请参考performance.md
*/

class Performance {
  constructor() {
    this.log = false; // 日志打印开关

    this.observe = false; // 监听

    this.slowerTime = 0; // 过慢资源时间

    this.port = ''; // 基础数据请求接口

    this.slowerPort = ''; // 筛选资源请求接口

    /** ********************************** —————— ********************************** **/

    this.baseFlag = false; // 建立完基础数据后，才允许发送资源数据

    this.ipData = {}; // ip数据

    this.performanceTime = {}; // performance埋点数据集合

    this.navigationTime = {}; // 当前浏览器统计埋点数据集合
  }

  // 自定义添加标记的时间, 方便我们计算程序的运行耗时
  _mark(s) {
    s && performance.mark && performance.mark(s);
  }

  // 包含了所有静态资源的数组列表
  // 获取性能条目缓冲区中所有条目的计时数据
  _getEntries() {
    return performance.getEntries ? performance.getEntries() : [];
  }

  // PerformanceEntry 对象的列表，基于给定的 entry type
  _getEntriesByType(s) {
    return performance.getEntriesByType ? performance.getEntriesByType(s) : [];
  }

  // 从浏览器的性能输入缓冲区中移除自定义添加的 measure
  _clearMarks(s) {
    performance.clearMarks && performance.clearMarks(s);
  }

  // PerformanceEntry 对象的列表，基于给定的 name 和 entry type。
  // 获取单个资源的性能条目
  // const heroImageTime = performance.getEntriesByName("https://somesite.com/images/hero-image.jpg");
  _getEntriesByName(s) {
    return performance.getEntriesByName ? performance.getEntriesByName(s) : [];
  }

  // JSON 格式转化器，返回 Performance 对象的 JSON 对象。
  _toJSON() {
    performance.toJSON && performance.toJSON();
  }

  // 初始化基础数据
  _initObject(_o) {
    const _i = Object.create({}, {
      c: {
        value: {
          time: null,
          name: '重定向耗时：'
        },
        writable: false,
        enumerable: true
      },
      d: {
        value: {
          time: null,
          name: 'DNS查询耗时：'
        },
        writable: false,
        enumerable: true
      },
      e: {
        value: {
          time: null,
          name: 'TLS连接耗时：'
        },
        writable: false,
        enumerable: true
      },
      f: {
        value: {
          time: null,
          name: 'TCP连接耗时：'
        },
        writable: false,
        enumerable: true
      },
      g: {
        value: {
          time: null,
          name: 'HTTP请求耗时：'
        },
        writable: false,
        enumerable: true
      },
      h: {
        value: {
          time: null,
          name: '第一个请求响应后为准计算的白屏时间：'
        },
        writable: false,
        enumerable: true
      },
      i: {
        value: {
          time: null,
          name: '纯DOM结构解析完成为准计算的白屏时间：'
        },
        writable: false,
        enumerable: true
      },
      j: {
        value: {
          time: null,
          name: 'dom结构耗时：'
        },
        writable: false,
        enumerable: true
      },
      k: {
        value: {
          time: null,
          name: 'DOMContentLoaded时间：'
        },
        writable: false,
        enumerable: true
      },
      l: {
        value: {
          time: null,
          name: '文档解析完成时间：'
        },
        writable: false,
        enumerable: true
      },
      m: {
        value: {
          time: null,
          name: '所有资源加载完毕耗时：'
        },
        writable: false,
        enumerable: true
      }
    });

    try {
      return Object.assign(_i, _o);
    } catch (e) {
      throw new TypeError('基础数据不可覆盖————', e);
    }
  }

  // 导航计时
  _performanceTime(_b) {
    const p = performance.timing;

    const v = this._initObject();

    const c = '#1890FF';

    this._addEventListen(this.performanceTime, v, p, c, _b);
  }

  // 浏览器导航计时
  _navigationTime(_b) {
    const _this = this;

    // window.PerformanceNavigationTiming执行应在DOM渲染完毕后执行
    const p = window.PerformanceNavigationTiming ? this._getEntriesByType('navigation')[0] : [];
    p.navigationStart = p.startTime;

    const v = this._initObject();

    const c = '#266fe2';

    this._addEventListen(this.navigationTime, v, p, c, _b);

    setTimeout(function () {
      // 需加事件循环，PerformancePaintTiming否则异步偶尔拿不到数据
      // 地址信息
      if (p.name) {
        v.a = {
          time: p.name,
          name: '解析地址'
        };
      } 
      // Chrome计算白屏方法
      // https://developers.google.cn/web/updates/2017/12/chrome-loadtimes-deprecated
      if (window.PerformancePaintTiming && _this._getEntriesByType('paint').length) {
        v.b = {
          // time: this.handleFixed((performance.getEntriesByType('paint')[0].startTime + performance.timeOrigin) / 1000),
          time: _this.handleFixed(_this._getEntriesByType('paint')[0].startTime),
          name: '谷歌计算的白屏时间：'
        };
      }

      ;
    }, 0);
  }

  // 监听获取数据节点
  // s this state
  // v 初始数据
  // p 捕获数据
  // c log颜色
  // _b 回调
  _addEventListen(s, v, p, c, _b) {
    const _this2 = this;
    this._timeCompute1(s, v, p, c); // f2 DOMContentLoaded


    const _f2 = function _f2() {
      // 必需加事件循环，因为统计是在执行DOMContentLoaded事件后捕获
      setTimeout(function () {
        _this2._timeCompute2(s, v, p, c);
      }, 0);
    }; // f3 load


    const _f3 = function _f3() {
      // 必需加事件循环，因为统计是在执行load事件后捕获
      setTimeout(function () {
        _this2._timeCompute3(s, v, p, c);

        _b && _b('Event_load');
      }, 0);
    };

    window.addEventListener('DOMContentLoaded', _f2);
    window.addEventListener('load', _f3); 
    
    // 拦截调试查看unload是否执行
    // window.addEventListener('beforeunload', (e) => {
    //     const evt = e || window.event;
    //     const dialogText = '';
    //     // 兼容IE8和Firefox 4之前的版本
    //     if (evt) {
    //         evt.returnValue = dialogText;
    //     };
    //     // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    //     return dialogText;
    // });

    // 兼容移动端 unload不执行
    window.addEventListener('pagehide', function () {
      window.removeEventListener('DOMContentLoaded', _f2);
      window.removeEventListener('load', _f3);
    }); 
    
    // 卸载监听的事件函数
    window.addEventListener('unload', function () {
      window.removeEventListener('DOMContentLoaded', _f2);
      window.removeEventListener('load', _f3);
    });
  }

  // 计算数据 Network Time
  _timeCompute1(s, _o, p) {
    // 重定向耗时：
    if (p.redirectEnd && p.redirectStart) {
      _o.c.time = this.handleFixed(p.redirectEnd - p.redirectStart);
    } 
    
    // DNS查询耗时：
    if (p.domainLookupEnd && p.domainLookupStart) {
      _o.d.time = this.handleFixed(p.domainLookupEnd - p.domainLookupStart);
    } 
    
    // TLS连接耗时：
    if (p.connectEnd && p.secureConnectionStart > 0) {
      _o.e.time = this.handleFixed(p.connectEnd - p.secureConnectionStart);
    } 
    
    // TCP连接耗时：
    if (p.connectEnd && p.connectStart) {
      _o.f.time = this.handleFixed(p.connectEnd - p.connectStart);
    }

    Object.assign(s, _o);
  }

  // 计算数据 DOMContentLoaded Time
  _timeCompute2(s, _o, p) {
    // service Workers time
    if (p.workerStart && p.fetchStart) {
      _o.a1.time = this.handleFixed(p.fetchStart - p.workerStart);
    } 
    
    // HTTP请求耗时：
    if (p.responseEnd && p.requestStart) {
      // Service worker time
      // if (p.workerStart > 0) {
      //     _o.g.time = p.responseEnd - p.workerStart;
      // }
      _o.g.time = this.handleFixed(p.responseEnd - p.requestStart);
    } 
    
    // 第一个请求响应后为准计算的白屏时间：
    if (p.responseStart) {
      _o.h.time = this.handleFixed(p.responseStart - p.navigationStart);
    } 
    
    // 纯DOM结构解析完成为准计算的白屏时间：
    if (p.domInteractive) {
      _o.i.time = this.handleFixed(p.domInteractive - p.navigationStart);
    } 
    
    // DOM结构耗时：
    if (p.domInteractive && p.domLoading) {
      _o.j.time = this.handleFixed(p.domInteractive - p.domLoading);
    } 
    
    // DOMContentLoaded时间：
    if (p.domContentLoadedEventEnd) {
      _o.k.time = this.handleFixed(p.domContentLoadedEventEnd - p.navigationStart);
    }

    Object.assign(s, _o);
  }

  // 计算数据 onload
  // s 存储至this
  // _o 初始数据
  // p 捕获数据
  // f log开关
  // c log颜色
  _timeCompute3(s, _o, p, c) {
    // 文档解析完成时间：
    if (p.domComplete && p.domLoading) {
      _o.l.time = this.handleFixed(p.domComplete - p.domLoading);
    } 
    // 所有资源加载完毕耗时：
    if (p.loadEventEnd) {
      _o.m.time = this.handleFixed(p.loadEventEnd - p.navigationStart);
    } 
    // 打印日志
    if (this.log === true) {
      console.info("%cperformance 和 navigation 统计埋点数据：", "color:".concat(c, ";"));

      for (let v in _o) {
        console.info("%c".concat(_o[v].name), "color:".concat(c, ";"), "".concat(_o[v].time));
      }
    }

    Object.assign(s, _o);
  }

  // 整合接口入参数据
  _integrationOption() {
    const base = this.handleBaseData();
    const network = this.handleNetworkData();
    const equipment = this.handleEquipmentData();
    const params = { ...base,
      ...network,
      ...equipment
    }; 
    
    // 打印日志
    if (this.log === true) {
      console.info("%c基础耗时数据：", "color:#b8920c;", base);
      console.info("%c网络信息数据：", "color:#b8920c;", network);
      console.info("%c用户设备数据：", "color:#b8920c;", equipment);
      console.info("%c接口入参数据：", "color:#FE4066;", params._s);
      console.info("%c接口入参数据——————复制mock数据：", "color:#b8920c;", params);
    } 

    // 发送请求
    // this._portBase(params);
    this.baseFlag = true;

    // if (this.slowerPort) {
      this._slowerResource();
    // }
  }
  
  // 上报日志统计
  _portBase(d) {
    this.baseFlag = true;
    const data = JSON.stringify({
      data: d
    });

    if ('sendBeacon' in navigator && navigator.sendBeacon(this.port, data)) {
      console.log('sendBeacon——port成功进入浏览器请求队列');
    } else {
      fetch(this.port, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: data
      }).then(function (r) {
        console.log(r);
      }).catch(function (e) {
        console.log(e);
      });
    }
  }

  // 上报资源统计
  _portResource(d) {
    if (!this.baseFlag || !d.length) return;
    console.info("%c抓取过慢资源数据：", "color:#b8920c;", d);
    console.info("%c抓取过慢资源数据——————复制mock数据：", "color:#b8920c;", JSON.stringify(d));
    const data = JSON.stringify({
      data: d
    });
    
    track("credit_performance", { ext: data });

    // if ('sendBeacon' in navigator && navigator.sendBeacon(this.slowerPort, data)) {
    //   console.info('sendBeacon——slowerPort成功进入浏览器请求队列');
    // } else {
    //   fetch(this.slowerPort, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     mode: 'cors',
    //     body: data
    //   }).then(function (r) {
    //     console.log(r);
    //   }).catch(function (e) {
    //     console.log(e);
    //   });
    // }
  }

  // 上报标记数据
  _portMark(p) {
    const m = performance.getEntriesByType('mark');

    if (Object.prototype.toString.call(p) !== '[object String]') {
      console.info('_portMark——请传入正确的请求地址');
      return;
    }

    if (!m.length) {
      console.info('_portMark——无mark记录');
      return;
    }

    const data = JSON.stringify({
      data: m
    });

    if ('sendBeacon' in navigator && navigator.sendBeacon(p, data)) {
      console.info('_portMark——成功进入浏览器请求队列');
    } else {
      fetch(p, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: data
      }).then(function (r) {
        console.log(r);
      }).catch(function (e) {
        console.log(e);
      });
    }
  }

  // 过慢资源条目统计
  _slowerResource(a) {
    const _this3 = this;

    const slowerResources = [];

    const _l = a || this._getEntriesByType('resource');

    _l.forEach(function (v) {
      if (v.responseEnd && v.fetchStart && v.responseEnd - v.fetchStart > _this3.slowerTime) {
        slowerResources.push({
          _n: v.name,
          _t: v.initiatorType,
          _r: _this3.handleFixed(v.responseEnd - v.fetchStart),
          _c: _this3._isCacheHit(v),
          _y: _this3._blockingTime(v) 
          // _x: this._is304(v),
        });
      }
    });

    this._portResource(slowerResources);
  }

  // 资源阻塞时间
  _blockingTime(_p = {}) {
    let blockingTime = 0;

    if (_p.connectEnd && _p.connectEnd === _p.fetchStart) {
      blockingTime = _p.requestStart - _p.connectEnd;
    } else if (_p.domainLookupStart) {
      blockingTime = _p.domainLookupStart - _p.fetchStart;
    }

    return blockingTime;
  }

  // 是否被缓存命中
  // 请注意，使用上述算法，返回a的条件验证将被视为缓存未命中。304 Not Modifed
  _isCacheHit(_p = {}) {
    // transferSize：为HTTP响应标头和内容主体传输的字节
    // 如果我们传输字节，它一定不是缓存命中(304 not Modified将返回false)
    if (_p.transferSize > 0) return false; // decodedBodySize：删除任何应用的内容编码后的主体大小
    // 如果body size是非0的，那就意味着这是一个ResourceTiming2浏览器，这是same-origin or TAO，而transferSize是0，所以它在缓存中

    if (_p.decodedBodySize > 0) return true; // duration 是获取资源所需的总时间
    // 退回到持续时间检查 (non-RT2 or cross-origin)

    return _p.duration < 30;
  }

  // 检测304
  // 暂不使用, encodedBodySize不准确 有疑问
  _is304(_p = {}) {
    if (_p.encodedBodySize > 0 && _p.tranferSize > 0 && _p.tranferSize < _p.encodedBodySize) {
      return true;
    } 
    // unknown
    return null;
  }

  // 监听缓存区，超出限制的操作
  _onBufferFull() {
    // 清除
    performance.onresourcetimingbufferfull = performance.onwebkitresourcetimingbufferfull = this._clearResourceBufferFull; // 初始化设置限制300
    // performance.setResourceTimingBufferSize && performance.setResourceTimingBufferSize(300);
  }

  // 清除缓存区
  _clearResourceBufferFull() {
    performance.clearResourceTimings();
  } 
  
  // 观察推送TYPE
  _performanceObserver() {
    const _this4 = this;

    if (typeof window.PerformanceObserver === 'function') {
      const perfObserver = new window.PerformanceObserver(function (list, obj) {
        const entries = list.getEntries();

        if (entries.length && entries[0].name && entries[0].name.indexOf(_this4.slowerPort) === -1) {
          _this4._slowerResource(entries);
        }
      });
      perfObserver.observe({
        entryTypes: ['navigation', 'resource', 'mark', 'paint']
      });
    } else {
      console.info('观察者模式建立失败，浏览器不支持PerformanceObserver');
    }
  }

  init(_e = {}) {
    const _this5 = this;

    // 初始化入参
    this.handleInitParams(_e); // 数据统计

    if ('performance' in window) {
      try {
        // 查阅基准点有无刷新
        console.log("%c".concat(new Date(performance.timeOrigin).toLocaleString(), "\u2014\u2014\u2014\u2014performance\u7EDF\u8BA1\u7CBE\u5EA6\u57FA\u51C6\u70B9\uFF1A").concat(performance.timeOrigin), 'color:#FAAD14;font-weight:bold'); // performance.timing计算（废弃，仍能取值，将来不再维护）

        const P1 = new Promise((resolve) => {
          _this5._performanceTime(resolve);
        }); 
        
        // performance.getEntriesByType计算（浏览器文档level2方法，精准）
        const P2 = new Promise((resolve) => {
          _this5._navigationTime(resolve);
        }); 
        
        // 火狐获取IP引擎
        // const P3 = new Promise((resolve) => {
        //   _this5.handleGetIp(resolve);
        // }); 
        
        // 合并取值
        Promise.all([P1, P2]).then(() => {
          _this5._integrationOption();
        });
      } catch (err) {
        console.error('浏览器不兼容或语法错误——————', err);
      }

      return this;
    }

    console.log("%c当前浏览器不支持performance", "color:#1890FF;font-weight:bold")
  }

  // 初始化入参
  handleInitParams(_e) {
    if (Object.prototype.toString.call(_e.log) === '[object Boolean]') {
      this.log = _e.log;
    }

    if (Object.prototype.toString.call(_e.observe) === '[object Boolean]') {
      this.observe = _e.observe;
    }

    if (Object.prototype.toString.call(_e.slowerTime) === '[object Number]' && !isNaN(_e.slowerTime)) {
      this.slowerTime = _e.slowerTime;
    }

    if (Object.prototype.toString.call(_e.port) === '[object String]') {
      this.port = _e.port;
    }

    if (Object.prototype.toString.call(_e.slowerPort) === '[object String]') {
      this.slowerPort = _e.slowerPort;
    }

    if (this.observe && this.slowerPort) {
      this._performanceObserver();

      this._onBufferFull();
    }
  }
  
  // 处理小数
  handleFixed(_n, _w = 3, _v = 1000) {
    return typeof _n === 'number' && !_n ? 0 : Number(_n / _v).toFixed(_w);
  }

  // 前端基础数据
  handleBaseData() {
    const base = {};

    for (let v in this.navigationTime) {
      base[v] = this.navigationTime[v].time;

      if (!base[v] && this.performanceTime[v] && this.performanceTime[v].time) {
        base[v] = this.performanceTime[v].time;
      }
    }

    return base;
  } 
  
  // 用户网络数据 （MDN暂不支持IOS）
  handleNetworkData() {
    const n = {};
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    n.n = connection.downlink; // 下行速度/带宽 Mb/s

    n.o = connection.type; // 连接类型 wifi 蜂窝

    n.p = connection.effectiveType || this.handleEffectiveType(); // 网络类型 2g 4g

    n.q = connection.rtt; // 估算的往返时间 ms

    n.r = connection.saveData; // 打开/请求数据保护模式

    n.s = 0; // 请求过程中切换网络状态的次数

    n.t = this.ipData.ip; // 用户ip

    n.u = this.ipData.cname; // 用户城市

    navigator.connection.addEventListener('change', function () {
      n.s += 1;
    });
    return n;
  } 
  
  // JS使用搜狐引擎获取用户IP
  handleGetIp(res) {
    const _this6 = this;

    let s = document.createElement('script');
    s.src = 'http://pv.sohu.com/cityjson?ie=utf-8';
    s.async = true;

    s.onload = function () {
      if (window.returnCitySN) {
        _this6.ipData.ip = window.returnCitySN['cip'];
        _this6.ipData.cname = window.returnCitySN['cname'];
        s.remove && s.remove();
        res();
      }
    };

    s.onerror = function () {
      res();
    };

    document.body.appendChild(s);
  } 
  
  // 用户网络类型
  handleEffectiveType() {
    const u = navigator.userAgent || '';
    let n;
    let networkStr = u.match(/NetType\/\w+/) ? u.match(/NetType\/\w+/)[0] : 'NetType/other';
    networkStr = networkStr.toLowerCase().replace('nettype/', '');

    switch (networkStr) {
      case 'wifi':
        n = 'wifi';
        break;

      case '4g':
        n = '4g';
        break;

      case '3g':
        n = '3g';
        break;

      case '3gnet':
        n = '3g';
        break;

      case '2g':
        n = '2g';
        break;

      default:
        n = 'other';
    }

    return n;
  } 
  
  // 用户设备数据
  handleEquipmentData() {
    const e = {}; // 端口类型

    e.v = this.handleEquipmentPortType(); // 设备类型

    e.w = this.handleEquipmentType(); // 浏览器类型

    e.x = this.handleEquipmentNaType(); // 版本信息

    e.y = navigator.appVersion; // 语言类型

    e.z = (navigator.browserLanguage || navigator.language).toLowerCase();
    return e;
  } 
  
  // 用户设备端口类型
  handleEquipmentPortType() {
    let u = navigator.userAgent || '';
        u = u.toLowerCase();
    const ipad = u.match(/ipad/i) == 'ipad';
    const iphone = u.match(/iphone os/i) == 'iphone os';
    const midp = u.match(/midp/i) == 'midp';
    const uc7 = u.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
    const uc = u.match(/ucweb/i) == 'ucweb';
    const android = u.match(/android/i) == 'android';
    const windowsce = u.match(/windows ce/i) == 'windows ce';
    const windowsmd = u.match(/windows mobile/i) == 'windows mobile';

    if (!(ipad || iphone || midp || uc7 || uc || android || windowsce || windowsmd)) {
      // PC 端
      return 0;
    } else {
      // 移动端
      return 1;
    }
  }
  
  // 用户设备类型
  handleEquipmentType() {
    let _s = 0;
    let u = navigator.userAgent || '';
        u = u.toLowerCase();

    switch (u) {
      case /\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(u):
        // ios
        _s = 1;
        break;

      case /android|adr/gi.test(u) || u.indexOf('Android') > -1 || u.indexOf('Linux') > -1:
        // android
        _s = 2;
        break;

      case /iPad/gi.test(u):
        // ipad
        _s = 3;
        break;
    }

    return _s;
  } 
  
  // 用户访问的浏览器类型
  handleEquipmentNaType() {
    let _s = 0;
    const u = navigator.userAgent || '';

    switch (u) {
      case u.indexOf('Opera') > -1:
        _s = 1; // Opera浏览器

        break;

      case u.indexOf('compatible') > -1 && u.indexOf('MSIE') > -1 && !u.indexOf('Opera') > -1:
        _s = 2; // IE浏览器

        break;

      case u.indexOf('Edge') > -1:
        _s = 3; // IE的Edge浏览器

        break;

      case u.indexOf('Firefox') > -1:
        _s = 4; // Firefox浏览器

        break;

      case u.indexOf('Safari') > -1 && u.indexOf('Chrome') == -1:
        _s = 5; // Safari浏览器

        break;

      case u.indexOf('Chrome') > -1 && u.indexOf('Safari') > -1:
        _s = 6; // Chrome浏览器

        break;
    }

    return _s;
  }
}

window.__pm__ = new Performance;
export default new Performance;
