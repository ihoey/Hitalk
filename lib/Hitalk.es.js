/*!
 * hitalk v1.2.1
 * (c) ihoey <mail@ihoey.com> (https://blog.ihoey.com/)
 * Released under the MIT License.
 */
import md5 from 'blueimp-md5';
import marked from 'marked';

var win = window || {};
var nav = navigator || {};

function Detect(userAgent) {
  var u = userAgent || nav.userAgent;

  var _this = this;

  var match = {
    //内核
    Trident: u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
    Presto: u.indexOf('Presto') > -1,
    WebKit: u.indexOf('AppleWebKit') > -1,
    Gecko: u.indexOf('Gecko/') > -1,
    //浏览器
    Safari: u.indexOf('Safari') > -1,
    Chrome: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
    IE: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
    Edge: u.indexOf('Edge') > -1,
    Firefox: u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
    'Firefox Focus': u.indexOf('Focus') > -1,
    Chromium: u.indexOf('Chromium') > -1,
    Opera: u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
    Vivaldi: u.indexOf('Vivaldi') > -1,
    Yandex: u.indexOf('YaBrowser') > -1,
    Kindle: u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
    '360': u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1,
    UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
    QQBrowser: u.indexOf('QQBrowser') > -1,
    QQ: u.indexOf('QQ/') > -1,
    Baidu: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
    Maxthon: u.indexOf('Maxthon') > -1,
    Sogou: u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
    LBBROWSER: u.indexOf('LBBROWSER') > -1,
    '2345Explorer': u.indexOf('2345Explorer') > -1,
    TheWorld: u.indexOf('TheWorld') > -1,
    XiaoMi: u.indexOf('MiuiBrowser') > -1,
    Quark: u.indexOf('Quark') > -1,
    Qiyu: u.indexOf('Qiyu') > -1,
    Wechat: u.indexOf('MicroMessenger') > -1,
    Taobao: u.indexOf('AliApp(TB') > -1,
    Alipay: u.indexOf('AliApp(AP') > -1,
    Weibo: u.indexOf('Weibo') > -1,
    Douban: u.indexOf('com.douban.frodo') > -1,
    Suning: u.indexOf('SNEBUY-APP') > -1,
    iQiYi: u.indexOf('IqiyiApp') > -1,
    //系统或平台
    Windows: u.indexOf('Windows') > -1,
    Linux: u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
    'Mac OS': u.indexOf('Macintosh') > -1,
    Android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
    Ubuntu: u.indexOf('Ubuntu') > -1,
    FreeBSD: u.indexOf('FreeBSD') > -1,
    Debian: u.indexOf('Debian') > -1,
    'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
    BlackBerry: u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
    MeeGo: u.indexOf('MeeGo') > -1,
    Symbian: u.indexOf('Symbian') > -1,
    iOS: u.indexOf('like Mac OS X') > -1,
    'Chrome OS': u.indexOf('CrOS') > -1,
    WebOS: u.indexOf('hpwOS') > -1,
    //设备
    Mobile: u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
    Tablet: u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
  }; //修正

  if (match['Mobile']) {
    match['Mobile'] = !(u.indexOf('iPad') > -1);
  } else if (win.showModalDialog && win.chrome) {
    match['360'] = true;
  } //基本信息


  var hash = {
    engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
    browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
    os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
    device: ['Mobile', 'Tablet']
  };
  _this.device = 'PC';

  _this.language = function () {
    var g = nav.browserLanguage || nav.language;
    var arr = g.split('-');

    if (arr[1]) {
      arr[1] = arr[1].toUpperCase();
    }

    return arr.join('_');
  }();

  for (var s in hash) {
    for (var i = 0; i < hash[s].length; i++) {
      var value = hash[s][i];

      if (match[value]) {
        _this[s] = value;
      }
    }
  } //系统版本信息


  var osVersion = {
    Windows: function () {
      var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
      var hash = {
        '6.4': '10',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.2': 'XP',
        '5.1': 'XP',
        '5.0': '2000'
      };
      return hash[v] || v;
    },
    Android: function () {
      return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
    },
    iOS: function () {
      return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
    },
    Debian: function () {
      return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
    },
    'Windows Phone': function () {
      return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
    },
    'Mac OS': function () {
      return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
    },
    WebOS: function () {
      return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
    }
  };
  _this.osVersion = '';

  if (osVersion[_this.os]) {
    _this.osVersion = osVersion[_this.os]();

    if (_this.osVersion == u) {
      _this.osVersion = '';
    }
  } //浏览器版本信息


  var version = {
    Safari: function () {
      return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
    },
    Chrome: function () {
      return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
    },
    IE: function () {
      return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
    },
    Edge: function () {
      return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
    },
    Firefox: function () {
      return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
    },
    'Firefox Focus': function () {
      return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
    },
    Chromium: function () {
      return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
    },
    Opera: function () {
      return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
    },
    Vivaldi: function () {
      return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
    },
    Yandex: function () {
      return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
    },
    Kindle: function () {
      return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
    },
    Maxthon: function () {
      return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
    },
    QQBrowser: function () {
      return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
    },
    QQ: function () {
      return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
    },
    Baidu: function () {
      return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
    },
    UC: function () {
      return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
    },
    Sogou: function () {
      return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
    },
    '2345Explorer': function () {
      return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
    },
    TheWorld: function () {
      return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
    },
    XiaoMi: function () {
      return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
    },
    Quark: function () {
      return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
    },
    Qiyu: function () {
      return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
    },
    Wechat: function () {
      return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
    },
    Taobao: function () {
      return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
    },
    Alipay: function () {
      return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
    },
    Weibo: function () {
      return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
    },
    Douban: function () {
      return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
    },
    Suning: function () {
      return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
    },
    iQiYi: function () {
      return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
    }
  };
  _this.version = '';

  if (version[_this.browser]) {
    _this.version = version[_this.browser]();

    if (_this.version == u) {
      _this.version = '';
    }
  } //修正


  if (_this.browser == 'Edge') {
    _this.engine = 'EdgeHTML';
  } else if (_this.browser == 'Chrome' && parseInt(_this.version) > 27) {
    _this.engine = 'Blink';
  } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
    _this.engine = 'Blink';
  } else if (_this.browser == 'Yandex') {
    _this.engine = 'Blink';
  } else if (_this.browser == undefined) {
    _this.browser = 'Unknow App';
  }
}

function detectFactory(u) {
  return new Detect(u);
}

var version = "1.2.1";

var HtmlUtil = {
  /**
   * HTML转码
   * @param {String} str
   * @return {String} result
   */
  encode: function encode(str) {
    return !!str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\'/g, '&#39;').replace(/\"/g, '&quot;') : '';
  },

  /**
   * HTML解码
   * @param {String} str
   * @return {String} result
   */
  decode: function decode(str) {
    return !!str ? str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"') : '';
  }

};

var dateFormat = function (date) {
  var vDay = padWithZeros(date.getDate(), 2);
  var vMonth = padWithZeros(date.getMonth() + 1, 2);
  var vYear = padWithZeros(date.getFullYear(), 2);
  return (vYear + "-" + vMonth + "-" + vDay);
};

var timeAgo = function (date) {
  try {
    var oldTime = date.getTime();
    var currTime = new Date().getTime();
    var diffValue = currTime - oldTime;
    var days = Math.floor(diffValue / (24 * 3600 * 1000));

    if (days === 0) {
      //计算相差小时数
      var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数

      var hours = Math.floor(leave1 / (3600 * 1000));

      if (hours === 0) {
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数

        var minutes = Math.floor(leave2 / (60 * 1000));

        if (minutes === 0) {
          //计算相差秒数
          var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数

          var seconds = Math.round(leave3 / 1000);
          return seconds + ' 秒前';
        }

        return minutes + ' 分钟前';
      }

      return hours + ' 小时前';
    }

    if (days < 0) { return '刚刚'; }

    if (days < 8) {
      return days + ' 天前';
    } else {
      return dateFormat(date);
    }
  } catch (error) {
    console.log(error);
  }
};

var padWithZeros = function (vNumber, width) {
  var numAsString = vNumber.toString();

  while (numAsString.length < width) {
    numAsString = '0' + numAsString;
  }

  return numAsString;
};

var Event = {
  on: function on(type, el, handler, capture) {
    if (el.addEventListener) { el.addEventListener(type, handler, capture || false); }else if (el.attachEvent) { el.attachEvent(("on" + type), handler); }else { el[("on" + type)] = handler; }
  },

  off: function off(type, el, handler, capture) {
    if (el.removeEventListener) { el.removeEventListener(type, handler, capture || false); }else if (el.detachEvent) { el.detachEvent(("on" + type), handler); }else { el[("on" + type)] = null; }
  }

};

var getLink = function (target) {
  return target.link || target.mail && ("mailto:" + (target.mail)) || 'javascript:void(0);';
};

var check = {
  mail: function mail(m) {
    return {
      k: /[\w-\.]+@([\w-]+\.)+[a-z]{2,3}/.test(m),
      v: m
    };
  },

  link: function link(l) {
    l = l.length > 0 && (/^(http|https)/.test(l) ? l : ("http://" + l));
    return {
      k: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(l),
      v: l
    };
  }

};

/*
 * @Author: Ihoey
 * @Email: mail@ihoey.com
 * @Date: 2018-04-20 23:53:17
 * @LastEditors: Ihoey
 * @LastEditTime: 2021-01-04 16:33:14
 */
var gravatar = {
  cdn: 'https://gravatar.loli.net/avatar/',
  ds: ['mm', 'identicon', 'monsterid', 'wavatar', 'retro', ''],
  params: '?s=40',
  hide: !1
};
var defaultComment = {
  comment: '',
  rid: '',
  nick: 'Guest',
  mail: '',
  link: '',
  ua: navigator.userAgent,
  url: '',
  pin: 0,
  like: 0
};
var GUEST_INFO = ['nick', 'mail', 'link'];
var store = localStorage;
var smiliesData = {
  泡泡: "呵呵|哈哈|吐舌|太开心|笑眼|花心|小乖|乖|捂嘴笑|滑稽|你懂的|不高兴|怒|汗|黑线|泪|真棒|喷|惊哭|阴险|鄙视|酷|啊|狂汗|what|疑问|酸爽|呀咩爹|委屈|惊讶|睡觉|笑尿|挖鼻|吐|犀利|小红脸|懒得理|勉强|爱心|心碎|玫瑰|礼物|彩虹|太阳|星星月亮|钱币|茶杯|蛋糕|大拇指|胜利|haha|OK|沙发|手纸|香蕉|便便|药丸|红领巾|蜡烛|音乐|灯泡|开心|钱|咦|呼|冷|生气|弱",
  阿鲁: "高兴|小怒|脸红|内伤|装大款|赞一个|害羞|汗|吐血倒地|深思|不高兴|无语|亲亲|口水|尴尬|中指|想一想|哭泣|便便|献花|皱眉|傻笑|狂汗|吐|喷水|看不见|鼓掌|阴暗|长草|献黄瓜|邪恶|期待|得意|吐舌|喷血|无所谓|观察|暗地观察|肿包|中枪|大囧|呲牙|抠鼻|不说话|咽气|欢呼|锁眉|蜡烛|坐等|击掌|惊喜|喜极而泣|抽烟|不出所料|愤怒|无奈|黑线|投降|看热闹|扇耳光|小眼睛|中刀"
};
var pReg = new RegExp('\\@\\(\\s*(' + smiliesData.泡泡 + ')\\s*\\)');
var aReg = new RegExp('\\#\\(\\s*(' + smiliesData.阿鲁 + ')\\s*\\)');
var subfix = '';

if (window.devicePixelRatio != undefined && window.devicePixelRatio >= 1.49) {
  subfix = '@2x';
}

var Hitalk = function Hitalk(option) {
  this.md5 = md5;
  this.version = version;
  var av = option.av || AV;
  var appId = option.app_id || option.appId;
  var appKey = option.app_key || option.appKey;
  var serverURLs = option.serverURLs || 'https://hitalk-api.ihoey.com';

  if (!appId || !appKey) {
    this.throw('初始化失败，请检查你的appid或者appkey.');
  }

  av.init({
    appId: appId,
    appKey: appKey,
    serverURLs: serverURLs
  });
  this.v = av;
  defaultComment.url = (option.path || location.pathname).replace(/index\.(html|htm)/, ''); // 分页

  this.pageSize = option.pageSize || 10;
  this.page = 0; // 评论数

  this.initCount(); // 初始化评论

  !!option && this.init(option);
};

Hitalk.prototype.throw = function throw$1 (msg) {
  throw new Error(("Hitalk: " + msg));
};

Hitalk.prototype.init = function init (option) {
    var this$1 = this;

  try {
    // get el
    var el = {}.toString.call(option.el) === '[object HTMLDivElement]' ? option.el : document.querySelectorAll(option.el)[0];

    if ({}.toString.call(el) != '[object HTMLDivElement]') {
      this.throw("The target element was not found.");
    }

    this.el = el;
    this.el.classList.add('Hitalk'); // 自定义 header

    var guest_info = option.guest_info || GUEST_INFO;
    var inputEl = guest_info.map(function (item) {
      switch (item) {
        case 'nick':
          return '<input name="nick" placeholder="称呼" class="vnick vinput" type="text">';

        case 'mail':
          return '<input name="mail" placeholder="邮箱(会收到提醒哦~)" class="vmail vinput" type="email">';

        case 'link':
          return '<input name="link" placeholder="网址 http(s)://" class="vlink vinput" type="text">';

        default:
          return '';
      }
    }); // 填充元素

    var placeholder = option.placeholder || '';
    var eleHTML = "\n      <div class=\"vwrap\">\n          <div class=\"welcome dn\">欢迎回来，{name}！<span class=\"info-edit\">修改</span></div>\n          <div class=\"" + ("vheader item" + (inputEl.length)) + "\">" + (inputEl.join('')) + "</div>\n          <div class=\"vedit\">\n              <textarea class=\"veditor vinput\" placeholder=\"" + placeholder + "\"></textarea>\n          </div>\n          <div class=\"vcontrol\">\n              <span class=\"col col-60 smilies\">\n                  <div class=\"col smilies-logo\"><span>^_^</span></div>\n                  <div class=\"col\" title=\"Markdown is Support\">MarkDown is Support</div>\n                  <div class=\"smilies-body\"></div>\n              </span>\n              <div class=\"col col-40 text-right\">\n                  <button type=\"button\" class=\"vsubmit vbtn\">回复</button>\n              </div>\n          </div>\n          <div class=\"vmark dn\"></div>\n      </div>\n      <div class=\"info\">\n          <div class=\"count col\"></div>\n      </div>\n      <div class=\"vloading\"></div>\n      <div class=\"vempty dn\"></div>\n      <ul class=\"vlist\"></ul>\n      <div class=\"vpage txt-right\"></div>";
    this.el.innerHTML = eleHTML; // Empty Data

    var vempty = this.el.querySelector('.vempty');
    var nodata$1 = {
      show: function show(txt) {
          if ( txt === void 0 ) txt = '还没有评论哦，快来抢沙发吧!';

        vempty.innerHTML = txt;
        vempty.classList.remove('dn');
      },

      hide: function hide() {
        vempty.classList.add('dn');
      }

    }; // loading

    var _spinner = "<div class=\"spinner\"><div class=\"r1\"></div><div class=\"r2\"></div><div class=\"r3\"></div><div class=\"r4\"></div><div class=\"r5\"></div></div>";
    var vloading = this.el.querySelector('.vloading');
    vloading.innerHTML = _spinner; // loading control

    this.loading = {};

    this.loading.show = function () {
      vloading.classList.remove('dn');
      nodata$1.hide();
    };

    this.loading.hide = function () {
      vloading.classList.add('dn');
      el.querySelectorAll('.vcard').length === 0 && nodata$1.show();
    };

    gravatar['params'] = '?d=' + (gravatar['ds'].indexOf(option.avatar) > -1 ? option.avatar : 'mm');
    gravatar['hide'] = option.avatar === 'hide' ? !0 : !1;
  } catch (ex) {
    var issue = 'https://github.com/ihoey/Hitalk/issues';
    if (this.el) { nodata.show(("<pre style=\"color:red;text-align:left;\">" + ex + "<br>Hitalk:<b>" + (this.version) + "</b><br>反馈：" + issue + "</pre>")); }else { console && console.log(("%c" + ex + "\n%cHitalk%c" + (this.version) + " " + issue), 'color:red;', 'background:#000;padding:5px;line-height:30px;color:#fff;', 'background:#456;line-height:30px;padding:5px;color:#fff;'); }
    return;
  }

  var _mark = this.el.querySelector('.vmark'); // alert


  this.alert = {};

  this.alert.show = function (o) {
    _mark.innerHTML = "<div class=\"valert txt-center\"><div class=\"vtext\">" + (o.text) + "</div><div class=\"vbtns\"></div></div>";

    var _vbtns = _mark.querySelector('.vbtns');

    var _cBtn = "<button class=\"vcancel vbtn\">" + (o && o.ctxt || '我再看看') + "</button>";
    var _oBtn = "<button class=\"vsure vbtn\">" + (o && o.otxt || '继续提交') + "</button>";
    _vbtns.innerHTML = "" + _cBtn + (o.type && _oBtn);

    _mark.querySelector('.vcancel').addEventListener('click', function (e) {
      this$1.alert.hide();
    });

    _mark.classList.remove('dn');

    if (o && o.type) {
      var _ok = _mark.querySelector('.vsure');

      Event.on('click', _ok, function (e) {
        this$1.alert.hide();
        o.cb && o.cb();
      });
    }
  };

  this.alert.hide = function () {
    _mark.classList.add('dn');
  }; // Bind Event


  this.bind(option);
};

Hitalk.prototype.commonQuery = function commonQuery (url) {
  var query = new this.v.Query('Comment');
  query.equalTo('url', url || defaultComment['url']).descending('createdAt');
  return query;
};

Hitalk.prototype.initCount = function initCount () {
    var this$1 = this;

  var pCount = document.querySelectorAll('.hitalk-comment-count');
  if (!pCount.length) { return false; }
  var vArr = [];
  var urlArr = [];

  for (var i = 0; i < pCount.length; i++) {
    var el = pCount[i];
    var url = el.getAttribute('data-xid').replace(/index\.(html|htm)/, '');
    urlArr[i] = url;
    vArr[i] = this.commonQuery(url);
  }

  var cq = new (Function.prototype.bind.apply( this.v.Query.or, [ null ].concat( vArr) ));
  cq.select('url').limit(1000).find().then(function (res) {
    urlArr.map(function (e, i) { return pCount[i].innerText = res.filter(function (x) { return e === x.get('url'); }).length; });
  }).catch(function (ex) {
    this$1.throw(ex);
  });
};
/**
 * Bind Event
 */


Hitalk.prototype.bind = function bind (option) {
    var this$1 = this;

  var guest_info = (option.guest_info || GUEST_INFO).filter(function (item) { return GUEST_INFO.indexOf(item) > -1; });

  var expandEvt = function (el) {
    if (el.offsetHeight > 180) {
      el.classList.add('expand');
      Event.on('click', el, function (e) {
        el.setAttribute('class', 'vcontent');
      });
    }
  };

  var insertDom = function (ret, mt) {
    var _vcard = document.createElement('li');

    _vcard.setAttribute('class', 'vcard');

    _vcard.setAttribute('id', ret.id);

    var _ua = detectFactory(ret.get('ua'));

    var _img = gravatar['hide'] ? '' : ("<img class=\"vimg\" src='" + (gravatar.cdn + md5(ret.get('mail') || ret.get('nick')) + gravatar.params) + "'>");

    _vcard.innerHTML = _img + "<section><div class=\"vhead\"><a rel=\"nofollow\" href=\"" + (getLink({
      link: ret.get('link'),
      mail: ret.get('mail')
    })) + "\" target=\"_blank\" >" + (ret.get('nick')) + "</a>\n      <span class=\"vsys\">" + (_ua.os) + " " + (_ua.osVersion) + "</span>\n      <span class=\"vsys\">" + (_ua.browser) + " " + (_ua.version) + "</span>\n      </div><div class=\"vcontent\">" + (ret.get('comment')) + "</div><div class=\"vfooter\"><span class=\"vtime\">" + (timeAgo(ret.get('createdAt'))) + "</span><span rid='" + (ret.id) + "' at='@" + (ret.get('nick')) + "' mail='" + (ret.get('mail')) + "' class=\"vat\">回复</span><div></section>";

    var _vlist = this$1.el.querySelector('.vlist');

    var _vlis = _vlist.querySelectorAll('li');

    var _vat = _vcard.querySelector('.vat');

    var _as = _vcard.querySelectorAll('a');

    for (var i = 0, len = _as.length; i < len; i++) {
      var item = _as[i];

      if (item && item.getAttribute('class') != 'at') {
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'nofollow');
      }
    }

    if (mt) { _vlist.appendChild(_vcard); }else { _vlist.insertBefore(_vcard, _vlis[0]); }

    var _vcontent = _vcard.querySelector('.vcontent');

    expandEvt(_vcontent);
    bindAtEvt(_vat);
  }; // 填充表情节点


  var addSmilies = function () {
    var _smilies = this$1.el.querySelector('.smilies-body');

    var _ul,
        _li = '';

    var fragment = document.createDocumentFragment();
    var sl = '泡泡';
    Object.keys(smiliesData).forEach(function (y, i) {
      _ul = document.createElement('ul');

      _ul.setAttribute('class', 'smilies-items smilies-items-biaoqing' + (y == sl ? ' smilies-items-show' : ''));

      _ul.setAttribute('data-id', i);

      smiliesData[y].split('|').forEach(function (e) {
        _ul.innerHTML += "<li class=\"smilies-item\" title=\"" + e + "\" data-input=\"" + ((y == sl ? '@' : '#') + "(" + e + ")") + "\"><img class=\"biaoqing " + (y == sl ? 'newpaopao' : 'alu') + "\" title=\"" + e + "\" src=\"https://cdn.ihoey.com/" + (y == sl ? 'newpaopao' : 'alu') + "/" + (e + subfix) + ".png\"></li>";
      });
      _li += "<li class=\"smilies-name " + (y == sl ? 'smilies-package-active' : '') + "\" data-id=\"" + i + "\"><span>" + y + "</span></li>";
      fragment.appendChild(_ul); //添加ul
    });

    var _div = document.createElement('div');

    _div.setAttribute('class', 'smilies-bar');

    _div.innerHTML = "<ul class=\"smilies-packages\">" + _li + "</ul>";
    fragment.appendChild(_div); //再次添加div

    _smilies.appendChild(fragment);

    var smilies = document.querySelector('.smilies');

    var _el = document.querySelector('.veditor');

    Event.on('click', smilies, function (e) {
      e = e.target;

      if (e.className == 'smilies-item') {
        _el.value += " " + (e.getAttribute('data-input')) + " ";
        defaultComment.comment = marked(_el.value, {
          sanitize: !0,
          breaks: !0
        });
        smilies.classList.remove('smilies-open');
      } else if (e.classList.contains('smilies-logo')) {
        smilies.classList.toggle('smilies-open');
      } else if (e.classList.contains('smilies-name')) {
        if (!e.classList.contains('smilies-package-active')) {
          document.querySelectorAll('.smilies-name').forEach(function (e) { return e.classList.remove('smilies-package-active'); });
          document.querySelectorAll('.smilies-items').forEach(function (e) { return e.classList.remove('smilies-items-show'); });
          document.querySelectorAll('.smilies-items')[e.getAttribute('data-id')].classList.add('smilies-items-show');
          e.classList.add('smilies-package-active');
        }
      }
    });
    Event.on('mouseup', document, function (e) {
      e = e.target;

      var _con = document.querySelector('.smilies');

      if (!_con === e || !_con.contains(e)) {
        smilies.classList.remove('smilies-open');
      }
    });
  };

  var query = function () {
    this$1.loading.show();
    addSmilies(); // 填充表情

    var cq = this$1.commonQuery();
    cq.limit(this$1.pageSize).skip(this$1.page * this$1.pageSize).find().then(function (rets) {
      var len = rets.length;

      if (len) {
        this$1.el.querySelector('.vlist').innerHTML = '';

        for (var i = 0; i < len; i++) {
          insertDom(rets[i], !0);
        }

        var _count = this$1.el.querySelector('.num');

        if (!_count) {
          cq.count().then(function (len) {
            var _pageCount = Math.ceil(len / this$1.pageSize);

            this$1.el.querySelector('.count').innerHTML = "评论(<span class=\"num\">" + len + "</span>)";

            var _pageDom = function (_class, _text) { return ("<span class=\"" + _class + " page-numbers\">" + _text + "</span>"); };

            var vpageDom = _pageDom('prev dn', '&lt;');

            for (var index = 1; index <= _pageCount; index++) {
              vpageDom += _pageDom(("numbers " + (index == 1 ? 'current' : '')), index);
            }

            vpageDom += _pageDom('next dn', '&gt;');
            this$1.el.querySelector('.vpage').innerHTML = vpageDom;
            pageHandle(len);
            Event.on('click', this$1.el.querySelector('.vpage'), function (e) {
              var inc = function (v) { return e.target.className.split(' ').includes(v); };

              if (inc('current') || inc('vpage')) {
                return;
              }

              if (inc('numbers')) {
                this$1.page = Number(e.target.innerText) - 1;
              } else if (inc('prev')) {
                this$1.page--;
              } else if (inc('next')) {
                this$1.page++;
              }

              query();
            });
          });
        } else {
          pageHandle(_count.innerText);
        }
      }

      this$1.loading.hide();
    }).catch(function (ex) {
      this$1.loading.hide();
      this$1.throw(ex);
    });
  };

  query();

  var pageHandle = function (_count) {
    if (this$1.el.querySelector('.vpage .numbers.current')) {
      this$1.el.querySelector('.vpage .numbers.current').classList.remove('current');
    }

    this$1.el.querySelectorAll('.vpage .numbers')[this$1.page].classList.add('current');
    var domClass = {
      0: '.prev'
    };
      domClass[Math.ceil(_count / this$1.pageSize, 10) - 1] = '.next';
    Object.values(domClass).map(function (e) { return this$1.el.querySelector((".vpage " + e)).classList.remove('dn'); });

    if (domClass[this$1.page]) {
      this$1.el.querySelector((".vpage " + (domClass[this$1.page]))).classList.add('dn');
      return;
    }
  };

  var mapping = {
    veditor: 'comment'
  };

  for (var i = 0, length = guest_info.length; i < length; i++) {
    mapping[("v" + (guest_info[i]))] = guest_info[i];
  }

  var inputs = {};

  for (var i$1 in mapping) {
    if (mapping.hasOwnProperty(i$1)) {
      var _v = mapping[i$1];

      var _el = this.el.querySelector(("." + i$1));

      inputs[_v] = _el;
      Event.on('input', _el, function (e) {
        defaultComment[_v] = _v === 'comment' ? marked(_el.value, {
          sanitize: !0,
          breaks: !0
        }) : HtmlUtil.encode(_el.value);
      });
    }
  } // cache


  var getCache = function () {
    var s = store && store.HitalkCache;

    if (s) {
      s = JSON.parse(s);
      var m = guest_info;

      for (var i in m) {
        var k = m[i];
        this$1.el.querySelector((".v" + k)).value = s[k];
        defaultComment[k] = s[k];
      }

      var welcome = this$1.el.querySelector(".welcome").innerHTML;
      this$1.el.querySelector(".welcome").classList.remove('dn');
      this$1.el.querySelector(".welcome").innerHTML = welcome.replace('{name}', s['nick']);
      this$1.el.querySelector(".vheader").classList.add('hide');
      Event.on('click', this$1.el.querySelector(".welcome .info-edit"), function (e) {
        this$1.el.querySelector(".vheader").classList.toggle('hide');
      });
    }
  };

  getCache();
  var atData = {
    rmail: '',
    at: ''
  }; // reset form

  var reset = function () {
    for (var i in mapping) {
      if (mapping.hasOwnProperty(i)) {
        var _v = mapping[i];

        var _el = this$1.el.querySelector(("." + i));

        _el.value = '';
        defaultComment[_v] = '';
      }
    }

    atData['at'] = '';
    atData['rmail'] = '';
    defaultComment['rid'] = '';
    defaultComment['nick'] = 'Guest';
    getCache();
  }; // submit


  var submitBtn = this.el.querySelector('.vsubmit');

  var submitEvt = function (e) {
    if (submitBtn.getAttribute('disabled')) {
      this$1.alert.show({
        type: '',
        text: '再等等，评论正在提交中ヾ(๑╹◡╹)ﾉ"',
        ctxt: '好的'
      });
      return;
    }

    if (defaultComment.comment == '') {
      inputs['comment'].focus();
      this$1.alert.show({
        type: '',
        text: '好歹也写点文字嘛ヾ(๑╹◡╹)ﾉ"',
        ctxt: '好的'
      });
      return;
    }

    if (defaultComment.nick == '') {
      defaultComment['nick'] = '小调皮';
    }

    var idx = defaultComment.comment.indexOf(atData.at);

    if (idx > -1 && atData.at != '') {
      var at = "<a class=\"at\" href='#" + (defaultComment.rid) + "'>" + (atData.at) + "</a>";
      defaultComment.comment = defaultComment.comment.replace(atData.at, at);
    } //表情


    var matched;

    while (matched = defaultComment.comment.match(pReg)) {
      defaultComment.comment = defaultComment.comment.replace(matched[0], ("<img src=\"https://cdn.ihoey.com/newpaopao/" + (matched[1] + subfix) + ".png\" class=\"biaoqing newpaopao\" height=30 width=30 no-zoom />"));
    }

    while (matched = defaultComment.comment.match(aReg)) {
      defaultComment.comment = defaultComment.comment.replace(matched[0], ("<img src=\"https://cdn.ihoey.com/alu/" + (matched[1] + subfix) + ".png\" class=\"biaoqing alu\" height=33 width=33 no-zoom />"));
    } // veirfy


    var mailRet = check.mail(defaultComment.mail);
    var linkRet = check.link(defaultComment.link);
    defaultComment['mail'] = mailRet.k ? mailRet.v : '';
    defaultComment['link'] = linkRet.k ? linkRet.v : '';

    var alertShow = function (text) {
      this$1.alert.show({
        type: 1,
        text: text,
        cb: function () { return commitEvt(); }
      });
    };

    if (!mailRet.k && !linkRet.k && guest_info.indexOf('mail') > -1 && guest_info.indexOf('link') > -1) {
      alertShow('您的网址和邮箱格式不正确, 是否继续提交?');
    } else if (!mailRet.k && guest_info.indexOf('mail') > -1) {
      alertShow('您的邮箱格式不正确, 是否继续提交?');
    } else if (!linkRet.k && guest_info.indexOf('link') > -1) {
      alertShow('您的网址格式不正确, 是否继续提交?');
    } else {
      commitEvt();
    }
  }; // setting access


  var getAcl = function () {
    var acl = new this$1.v.ACL();
    acl.setPublicReadAccess(!0);
    acl.setPublicWriteAccess(!1);
    return acl;
  };

  var commitEvt = function () {
    submitBtn.setAttribute('disabled', !0);
    this$1.loading.show(); // 声明类型

    var Ct = this$1.v.Object.extend('Comment'); // 新建对象

    var comment = new Ct();

    for (var i in defaultComment) {
      if (defaultComment.hasOwnProperty(i)) {
        var _v = defaultComment[i];
        comment.set(i, _v);
      }
    }

    comment.setACL(getAcl());
    comment.save().then(function (ret) {
      defaultComment['nick'] != 'Guest' && store && store.setItem('HitalkCache', JSON.stringify({
        nick: defaultComment['nick'],
        link: defaultComment['link'],
        mail: defaultComment['mail']
      }));

      var _count = this$1.el.querySelector('.num');

      var num = 1;

      try {
        if (_count) {
          num = Number(_count.innerText) + 1;
          _count.innerText = num;
        } else {
          this$1.el.querySelector('.count').innerHTML = '评论(<span class="num">1</span>)';
        }

        insertDom(ret);
        defaultComment['mail'] && signUp({
          username: defaultComment['nick'],
          mail: defaultComment['mail']
        });
        submitBtn.removeAttribute('disabled');
        this$1.loading.hide();
        reset();
      } catch (error) {
        console.log(error);
      }
    }).catch(function (ex) {
      this$1.loading.hide();
      this$1.throw(ex);
    });
  };

  var signUp = function (o) {
    var u = new this$1.v.User();
    u.setUsername(o.username);
    u.setPassword(o.mail);
    u.setEmail(o.mail);
    u.setACL(getAcl());
    return u.signUp();
  }; // at event


  var bindAtEvt = function (el) {
    Event.on('click', el, function (e) {
      var at = el.getAttribute('at');
      var rid = el.getAttribute('rid');
      var rmail = el.getAttribute('mail');
      atData['at'] = at;
      atData['rmail'] = rmail;
      defaultComment['rid'] = rid;
      inputs['comment'].value = at + " ";
      inputs['comment'].focus();
    });
  };

  Event.off('click', submitBtn, submitEvt);
  Event.on('click', submitBtn, submitEvt);
};

export default Hitalk;
