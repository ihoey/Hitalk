# Hitalk

> 一款快速、简洁且高效的无后端评论系统。

## 是什么

`Hitalk` 是一款基于 `Leancloud` 的快速、简洁且高效的无后端评论系统。

![](https://img.shields.io/badge/language-JavaScript-blue.svg?style=flat-square)
![](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![](https://img.shields.io/badge/name-Hitalk-brightgreen.svg?style=flat-square)
[![](https://img.shields.io/badge/github-ihoey-orange.svg?style=flat-square)](https://github.com/ihoey)
[![](https://img.shields.io/badge/QQ-✘д✘ヽゝだよ-red.svg?style=flat-square)](http://wpa.qq.com/msgrd?v=3&uin=1058221214&site=qq&menu=yes)
[![](https://img.shields.io/badge/blog-ihoey-ff69b4.svg?style=flat-square)](https://blog.ihoey.com)

查看[快速开始](#快速开始)了解详情。

## 特性

- 快速
- 安全
- 无后端实现
- `MarkDown` 全语法支持
- 轻量易用(`~15kb gzipped`)

## 捐赠

如果你觉得 `Hitalk` 对你有帮助，或者想对我微小的工作一点资瓷，欢迎给我捐赠。

https://sponsor.ihoey.com/

## 快速开始

### HTML 片段

请在需要评论框的文章页内相应位置引入下面的`HTML`代码：

```html
<head>
  ...
  <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
  <script src="//cdn.ihoey.com/Hitalk.min.js"></script>
  ...
</head>
<body>
  ...
  <div id="comment"></div>
</body>
```

### 获取 appid 和 appkey

请先登录或注册 [LeanCloud](https://leancloud.cn/), 进入控制台后点击左下角创建应用：

应用创建好以后，进入刚刚创建的应用，选择左下角的 设置 > 应用 `Key` ，然后就能看到你的 `appid` 和 `appkey` 了：

**为了您的数据安全，请注意设置自己的安全域名~**

### 配置

修改初始化对象中的 `appId` 和 `appKey` 的值为上面刚刚获取到的值即可(其他可以默认)。

```js
new Hitalk({
  el: '#comment',
  appId: '这里填上面获得的appid',
  appKey: '这里填上面获得的appkey',
  placeholder: 'just go go',
  path: window.location.pathname,
  avatar: 'mm'
})
```

### 评论数据管理

关于评论数据管理，请自行登录 `Leancloud` 应用管理。
具体步骤：登录 > 选择你创建的应用 > 存储 > 选择 `Class` > `Comment`
然后就可以尽情的发挥你的权利啦(～￣ ▽ ￣)～
