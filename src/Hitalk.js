/*
 * @Author: Ihoey
 * @Email: mail@ihoey.com
 * @Date: 2018-04-20 23:53:17
 * @LastEditors: Ihoey
 * @LastEditTime: 2020-06-25 17:08:06
 */

import md5 from 'blueimp-md5'
import marked from 'marked'
import detect from './detect'
import './Hitalk.scss'
import { version } from '../package'
import { HtmlUtil, Event, check, getLink, dateFormat, timeAgo } from './utils'

const gravatar = {
  cdn: 'https://gravatar.loli.net/avatar/',
  ds: ['mm', 'identicon', 'monsterid', 'wavatar', 'retro', ''],
  params: '?s=40',
  hide: !1
}
const defaultComment = {
  comment: '',
  rid: '',
  nick: 'Guest',
  mail: '',
  link: '',
  ua: navigator.userAgent,
  url: '',
  pin: 0,
  like: 0
}
const GUEST_INFO = ['nick', 'mail', 'link']
const store = localStorage

const smiliesData = {
  泡泡: `呵呵|哈哈|吐舌|太开心|笑眼|花心|小乖|乖|捂嘴笑|滑稽|你懂的|不高兴|怒|汗|黑线|泪|真棒|喷|惊哭|阴险|鄙视|酷|啊|狂汗|what|疑问|酸爽|呀咩爹|委屈|惊讶|睡觉|笑尿|挖鼻|吐|犀利|小红脸|懒得理|勉强|爱心|心碎|玫瑰|礼物|彩虹|太阳|星星月亮|钱币|茶杯|蛋糕|大拇指|胜利|haha|OK|沙发|手纸|香蕉|便便|药丸|红领巾|蜡烛|音乐|灯泡|开心|钱|咦|呼|冷|生气|弱`,
  阿鲁: `高兴|小怒|脸红|内伤|装大款|赞一个|害羞|汗|吐血倒地|深思|不高兴|无语|亲亲|口水|尴尬|中指|想一想|哭泣|便便|献花|皱眉|傻笑|狂汗|吐|喷水|看不见|鼓掌|阴暗|长草|献黄瓜|邪恶|期待|得意|吐舌|喷血|无所谓|观察|暗地观察|肿包|中枪|大囧|呲牙|抠鼻|不说话|咽气|欢呼|锁眉|蜡烛|坐等|击掌|惊喜|喜极而泣|抽烟|不出所料|愤怒|无奈|黑线|投降|看热闹|扇耳光|小眼睛|中刀`
}
const pReg = new RegExp('\\@\\(\\s*(' + smiliesData.泡泡 + ')\\s*\\)')
const aReg = new RegExp('\\#\\(\\s*(' + smiliesData.阿鲁 + ')\\s*\\)')
let subfix = ''
if (window.devicePixelRatio != undefined && window.devicePixelRatio >= 1.49) {
  subfix = '@2x'
}

class Hitalk {
  constructor(option) {
    this.md5 = md5
    this.version = version

    const av = option.av || AV
    const appId = option.app_id || option.appId
    const appKey = option.app_key || option.appKey
    const serverURLs = option.serverURLs || 'https://hitalk.dode.top'

    if (!appId || !appKey) {
      this.throw('初始化失败，请检查你的appid或者appkey.')
    }

    av.init({ appId, appKey, serverURLs })
    this.v = av

    defaultComment.url = (option.path || location.pathname).replace(/index\.(html|htm)/, '')
    // 分页
    this.pageSize = option.pageSize || 10
    this.page = 0
    // 评论数
    this.initCount()
    // 初始化评论
    !!option && this.init(option)
  }

  throw(msg) {
    throw new Error(`Hitalk: ${msg}`)
  }

  init(option) {
    try {
      // get el
      let el =
        {}.toString.call(option.el) === '[object HTMLDivElement]' ? option.el : document.querySelectorAll(option.el)[0]
      if ({}.toString.call(el) != '[object HTMLDivElement]') {
        this.throw(`The target element was not found.`)
      }
      this.el = el
      this.el.classList.add('Hitalk')

      // 自定义 header
      const guest_info = option.guest_info || GUEST_INFO
      const inputEl = guest_info.map(item => {
        switch (item) {
          case 'nick':
            return '<input name="nick" placeholder="称呼" class="vnick vinput" type="text">'
          case 'mail':
            return '<input name="mail" placeholder="邮箱(会收到提醒哦~)" class="vmail vinput" type="email">'
          case 'link':
            return '<input name="link" placeholder="网址 http(s)://" class="vlink vinput" type="text">'
          default:
            return ''
        }
      })

      // 填充元素
      let placeholder = option.placeholder || ''
      let eleHTML = `
      <div class="vwrap">
          <div class="welcome dn">欢迎回来，{name}！<span class="info-edit">修改</span></div>
          <div class="${`vheader item${inputEl.length}`}">${inputEl.join('')}</div>
          <div class="vedit">
              <textarea class="veditor vinput" placeholder="${placeholder}"></textarea>
          </div>
          <div class="vcontrol">
              <span class="col col-60 smilies">
                  <div class="col smilies-logo"><span>^_^</span></div>
                  <div class="col" title="Markdown is Support">MarkDown is Support</div>
                  <div class="smilies-body"></div>
              </span>
              <div class="col col-40 text-right">
                  <button type="button" class="vsubmit vbtn">回复</button>
              </div>
          </div>
          <div class="vmark dn"></div>
      </div>
      <div class="info">
          <div class="count col"></div>
      </div>
      <div class="vloading"></div>
      <div class="vempty dn"></div>
      <ul class="vlist"></ul>
      <div class="vpage txt-right"></div>`

      this.el.innerHTML = eleHTML

      // Empty Data
      let vempty = this.el.querySelector('.vempty')
      const nodata = {
        show(txt = '还没有评论哦，快来抢沙发吧!') {
          vempty.innerHTML = txt
          vempty.classList.remove('dn')
        },
        hide() {
          vempty.classList.add('dn')
        }
      }

      // loading
      let _spinner = `<div class="spinner"><div class="r1"></div><div class="r2"></div><div class="r3"></div><div class="r4"></div><div class="r5"></div></div>`
      let vloading = this.el.querySelector('.vloading')
      vloading.innerHTML = _spinner
      // loading control
      this.loading = {}
      this.loading.show = () => {
        vloading.classList.remove('dn')
        nodata.hide()
      }
      this.loading.hide = () => {
        vloading.classList.add('dn')
        el.querySelectorAll('.vcard').length === 0 && nodata.show()
      }

      gravatar['params'] = '?d=' + (gravatar['ds'].indexOf(option.avatar) > -1 ? option.avatar : 'mm')
      gravatar['hide'] = option.avatar === 'hide' ? !0 : !1
    } catch (ex) {
      let issue = 'https://github.com/ihoey/Hitalk/issues'
      if (this.el)
        nodata.show(
          `<pre style="color:red;text-align:left;">${ex}<br>Hitalk:<b>${this.version}</b><br>反馈：${issue}</pre>`
        )
      else
        console &&
          console.log(
            `%c${ex}\n%cHitalk%c${this.version} ${issue}`,
            'color:red;',
            'background:#000;padding:5px;line-height:30px;color:#fff;',
            'background:#456;line-height:30px;padding:5px;color:#fff;'
          )
      return
    }

    let _mark = this.el.querySelector('.vmark')
    // alert
    this.alert = {}
    this.alert.show = o => {
      _mark.innerHTML = `<div class="valert txt-center"><div class="vtext">${o.text}</div><div class="vbtns"></div></div>`
      let _vbtns = _mark.querySelector('.vbtns')
      let _cBtn = `<button class="vcancel vbtn">${(o && o.ctxt) || '我再看看'}</button>`
      let _oBtn = `<button class="vsure vbtn">${(o && o.otxt) || '继续提交'}</button>`
      _vbtns.innerHTML = `${_cBtn}${o.type && _oBtn}`
      _mark.querySelector('.vcancel').addEventListener('click', e => {
        this.alert.hide()
      })
      _mark.classList.remove('dn')
      if (o && o.type) {
        let _ok = _mark.querySelector('.vsure')
        Event.on('click', _ok, e => {
          this.alert.hide()
          o.cb && o.cb()
        })
      }
    }
    this.alert.hide = () => {
      _mark.classList.add('dn')
    }

    // Bind Event
    this.bind(option)
  }

  commonQuery(url) {
    let query = new this.v.Query('Comment')
    query.equalTo('url', url || defaultComment['url']).descending('createdAt')
    return query
  }

  initCount() {
    const pCount = document.querySelectorAll('.hitalk-comment-count')
    if (!pCount.length) return false

    const vArr = []
    const urlArr = []

    for (let i = 0; i < pCount.length; i++) {
      const el = pCount[i]
      const url = el.getAttribute('data-xid').replace(/index\.(html|htm)/, '')

      urlArr[i] = url
      vArr[i] = this.commonQuery(url)
    }

    const cq = new this.v.Query.or(...vArr)
    cq.select('url')
      .limit(1000)
      .find()
      .then(res => {
        urlArr.map((e, i) => (pCount[i].innerText = res.filter(x => e === x.get('url')).length))
      })
      .catch(ex => {
        this.throw(ex)
      })
  }
  /**
   * Bind Event
   */
  bind(option) {
    let guest_info = (option.guest_info || GUEST_INFO).filter(item => GUEST_INFO.indexOf(item) > -1)

    let expandEvt = el => {
      if (el.offsetHeight > 180) {
        el.classList.add('expand')
        Event.on('click', el, e => {
          el.setAttribute('class', 'vcontent')
        })
      }
    }

    let insertDom = (ret, mt) => {
      let _vcard = document.createElement('li')
      _vcard.setAttribute('class', 'vcard')
      _vcard.setAttribute('id', ret.id)
      let _ua = detect(ret.get('ua'))
      let _img = gravatar['hide']
        ? ''
        : `<img class="vimg" src='${gravatar.cdn + md5(ret.get('mail') || ret.get('nick')) + gravatar.params}'>`
      _vcard.innerHTML = `${_img}<section><div class="vhead"><a rel="nofollow" href="${getLink({
        link: ret.get('link'),
        mail: ret.get('mail')
      })}" target="_blank" >${ret.get('nick')}</a>
      <span class="vsys">${_ua.os} ${_ua.osVersion}</span>
      <span class="vsys">${_ua.browser} ${_ua.version}</span>
      </div><div class="vcontent">${ret.get('comment')}</div><div class="vfooter"><span class="vtime">${timeAgo(
        ret.get('createdAt')
      )}</span><span rid='${ret.id}' at='@${ret.get('nick')}' mail='${ret.get(
        'mail'
      )}' class="vat">回复</span><div></section>`

      let _vlist = this.el.querySelector('.vlist')
      let _vlis = _vlist.querySelectorAll('li')
      let _vat = _vcard.querySelector('.vat')
      let _as = _vcard.querySelectorAll('a')
      for (let i = 0, len = _as.length; i < len; i++) {
        let item = _as[i]
        if (item && item.getAttribute('class') != 'at') {
          item.setAttribute('target', '_blank')
          item.setAttribute('rel', 'nofollow')
        }
      }
      if (mt) _vlist.appendChild(_vcard)
      else _vlist.insertBefore(_vcard, _vlis[0])
      let _vcontent = _vcard.querySelector('.vcontent')
      expandEvt(_vcontent)
      bindAtEvt(_vat)
    }

    // 填充表情节点
    let addSmilies = () => {
      let _smilies = this.el.querySelector('.smilies-body')
      let _ul,
        _li = ''
      let fragment = document.createDocumentFragment()
      const sl = '泡泡'
      Object.keys(smiliesData).forEach((y, i) => {
        _ul = document.createElement('ul')
        _ul.setAttribute('class', 'smilies-items smilies-items-biaoqing' + (y == sl ? ' smilies-items-show' : ''))
        _ul.setAttribute('data-id', i)
        smiliesData[y].split('|').forEach(e => {
          _ul.innerHTML += `<li class="smilies-item" title="${e}" data-input="${
            (y == sl ? '@' : '#') + `(${e})`
          }"><img class="biaoqing ${y == sl ? 'newpaopao' : 'alu'}" title="${e}" src="https://cdn.dode.top/${
            y == sl ? 'newpaopao' : 'alu'
          }/${e + subfix}.png"></li>`
        })
        _li += `<li class="smilies-name ${
          y == sl ? 'smilies-package-active' : ''
        }" data-id="${i}"><span>${y}</span></li>`
        fragment.appendChild(_ul) //添加ul
      })
      let _div = document.createElement('div')
      _div.setAttribute('class', 'smilies-bar')
      _div.innerHTML = `<ul class="smilies-packages">${_li}</ul>`
      fragment.appendChild(_div) //再次添加div
      _smilies.appendChild(fragment)

      let smilies = document.querySelector('.smilies')
      let _el = document.querySelector('.veditor')

      Event.on('click', smilies, e => {
        e = e.target
        if (e.className == 'smilies-item') {
          _el.value += ` ${e.getAttribute('data-input')} `
          defaultComment.comment = marked(_el.value, {
            sanitize: !0,
            breaks: !0
          })
          smilies.classList.remove('smilies-open')
        } else if (e.classList.contains('smilies-logo')) {
          smilies.classList.toggle('smilies-open')
        } else if (e.classList.contains('smilies-name')) {
          if (!e.classList.contains('smilies-package-active')) {
            document.querySelectorAll('.smilies-name').forEach(e => e.classList.remove('smilies-package-active'))
            document.querySelectorAll('.smilies-items').forEach(e => e.classList.remove('smilies-items-show'))
            document.querySelectorAll('.smilies-items')[e.getAttribute('data-id')].classList.add('smilies-items-show')
            e.classList.add('smilies-package-active')
          }
        }
      })

      Event.on('mouseup', document, e => {
        e = e.target
        let _con = document.querySelector('.smilies')
        if (!_con === e || !_con.contains(e)) {
          smilies.classList.remove('smilies-open')
        }
      })
    }

    let query = () => {
      this.loading.show()
      addSmilies() // 填充表情
      let cq = this.commonQuery()
      cq.limit(this.pageSize)
        .skip(this.page * this.pageSize)
        .find()
        .then(rets => {
          let len = rets.length
          if (len) {
            this.el.querySelector('.vlist').innerHTML = ''
            for (let i = 0; i < len; i++) {
              insertDom(rets[i], !0)
            }
            let _count = this.el.querySelector('.num')
            if (!_count) {
              cq.count().then(len => {
                const _pageCount = Math.ceil(len / this.pageSize)
                this.el.querySelector('.count').innerHTML = `评论(<span class="num">${len}</span>)`

                const _pageDom = (_class, _text) => `<span class="${_class} page-numbers">${_text}</span>`
                let vpageDom = _pageDom('prev dn', '&lt;')
                for (let index = 1; index <= _pageCount; index++) {
                  vpageDom += _pageDom(`numbers ${index == 1 ? 'current' : ''}`, index)
                }
                vpageDom += _pageDom('next dn', '&gt;')
                this.el.querySelector('.vpage').innerHTML = vpageDom

                pageHandle(len)

                Event.on('click', this.el.querySelector('.vpage'), e => {
                  const inc = v => e.target.className.split(' ').includes(v)
                  if (inc('current') || inc('vpage')) {
                    return
                  }
                  if (inc('numbers')) {
                    this.page = Number(e.target.innerText) - 1
                  } else if (inc('prev')) {
                    this.page--
                  } else if (inc('next')) {
                    this.page++
                  }
                  query()
                })
              })
            } else {
              pageHandle(_count.innerText)
            }
          }
          this.loading.hide()
        })
        .catch(ex => {
          this.loading.hide()
          this.throw(ex)
        })
    }
    query()

    let pageHandle = _count => {
      if (this.el.querySelector('.vpage .numbers.current')) {
        this.el.querySelector('.vpage .numbers.current').classList.remove('current')
      }
      this.el.querySelectorAll('.vpage .numbers')[this.page].classList.add('current')

      const domClass = {
        0: '.prev',
        [Math.ceil(_count / this.pageSize, 10) - 1]: '.next'
      }

      Object.values(domClass).map(e => this.el.querySelector(`.vpage ${e}`).classList.remove('dn'))
      if (domClass[this.page]) {
        this.el.querySelector(`.vpage ${domClass[this.page]}`).classList.add('dn')
        return
      }
    }

    let mapping = {
      veditor: 'comment'
    }
    for (let i = 0, length = guest_info.length; i < length; i++) {
      mapping[`v${guest_info[i]}`] = guest_info[i]
    }

    let inputs = {}
    for (let i in mapping) {
      if (mapping.hasOwnProperty(i)) {
        let _v = mapping[i]
        let _el = this.el.querySelector(`.${i}`)
        inputs[_v] = _el
        Event.on('input', _el, e => {
          defaultComment[_v] =
            _v === 'comment'
              ? marked(_el.value, {
                  sanitize: !0,
                  breaks: !0
                })
              : HtmlUtil.encode(_el.value)
        })
      }
    }

    // cache
    let getCache = () => {
      let s = store && store.HitalkCache
      if (s) {
        s = JSON.parse(s)
        let m = guest_info
        for (let i in m) {
          let k = m[i]
          this.el.querySelector(`.v${k}`).value = s[k]
          defaultComment[k] = s[k]
        }
        const welcome = this.el.querySelector(`.welcome`).innerHTML
        this.el.querySelector(`.welcome`).classList.remove('dn')
        this.el.querySelector(`.welcome`).innerHTML = welcome.replace('{name}', s['nick'])
        this.el.querySelector(`.vheader`).classList.add('hide')
        Event.on('click', this.el.querySelector(`.welcome .info-edit`), e => {
          this.el.querySelector(`.vheader`).classList.toggle('hide')
        })
      }
    }
    getCache()

    let atData = {
      rmail: '',
      at: ''
    }

    // reset form
    let reset = () => {
      for (let i in mapping) {
        if (mapping.hasOwnProperty(i)) {
          let _v = mapping[i]
          let _el = this.el.querySelector(`.${i}`)
          _el.value = ''
          defaultComment[_v] = ''
        }
      }
      atData['at'] = ''
      atData['rmail'] = ''
      defaultComment['rid'] = ''
      defaultComment['nick'] = 'Guest'
      getCache()
    }

    // submit
    let submitBtn = this.el.querySelector('.vsubmit')
    let submitEvt = e => {
      if (submitBtn.getAttribute('disabled')) {
        this.alert.show({
          type: '',
          text: '再等等，评论正在提交中ヾ(๑╹◡╹)ﾉ"',
          ctxt: '好的'
        })
        return
      }
      if (defaultComment.comment == '') {
        inputs['comment'].focus()
        this.alert.show({
          type: '',
          text: '好歹也写点文字嘛ヾ(๑╹◡╹)ﾉ"',
          ctxt: '好的'
        })
        return
      }
      if (defaultComment.nick == '') {
        defaultComment['nick'] = '小调皮'
      }
      let idx = defaultComment.comment.indexOf(atData.at)
      if (idx > -1 && atData.at != '') {
        let at = `<a class="at" href='#${defaultComment.rid}'>${atData.at}</a>`
        defaultComment.comment = defaultComment.comment.replace(atData.at, at)
      }
      //表情
      var matched
      while ((matched = defaultComment.comment.match(pReg))) {
        defaultComment.comment = defaultComment.comment.replace(
          matched[0],
          `<img src="https://cdn.dode.top/newpaopao/${
            matched[1] + subfix
          }.png" class="biaoqing newpaopao" height=30 width=30 no-zoom />`
        )
      }
      while ((matched = defaultComment.comment.match(aReg))) {
        defaultComment.comment = defaultComment.comment.replace(
          matched[0],
          `<img src="https://cdn.dode.top/alu/${
            matched[1] + subfix
          }.png" class="biaoqing alu" height=33 width=33 no-zoom />`
        )
      }

      // veirfy
      let mailRet = check.mail(defaultComment.mail)
      let linkRet = check.link(defaultComment.link)
      defaultComment['mail'] = mailRet.k ? mailRet.v : ''
      defaultComment['link'] = linkRet.k ? linkRet.v : ''
      const alertShow = text => {
        this.alert.show({
          type: 1,
          text,
          cb: () => commitEvt()
        })
      }

      if (!mailRet.k && !linkRet.k && guest_info.indexOf('mail') > -1 && guest_info.indexOf('link') > -1) {
        alertShow('您的网址和邮箱格式不正确, 是否继续提交?')
      } else if (!mailRet.k && guest_info.indexOf('mail') > -1) {
        alertShow('您的邮箱格式不正确, 是否继续提交?')
      } else if (!linkRet.k && guest_info.indexOf('link') > -1) {
        alertShow('您的网址格式不正确, 是否继续提交?')
      } else {
        commitEvt()
      }
    }

    // setting access
    let getAcl = () => {
      let acl = new this.v.ACL()
      acl.setPublicReadAccess(!0)
      acl.setPublicWriteAccess(!1)
      return acl
    }

    let commitEvt = () => {
      submitBtn.setAttribute('disabled', !0)
      this.loading.show()
      // 声明类型
      let Ct = this.v.Object.extend('Comment')
      // 新建对象
      let comment = new Ct()
      for (let i in defaultComment) {
        if (defaultComment.hasOwnProperty(i)) {
          let _v = defaultComment[i]
          comment.set(i, _v)
        }
      }
      comment.setACL(getAcl())
      comment
        .save()
        .then(ret => {
          defaultComment['nick'] != 'Guest' &&
            store &&
            store.setItem(
              'HitalkCache',
              JSON.stringify({
                nick: defaultComment['nick'],
                link: defaultComment['link'],
                mail: defaultComment['mail']
              })
            )
          let _count = this.el.querySelector('.num')
          let num = 1
          try {
            if (_count) {
              num = Number(_count.innerText) + 1
              _count.innerText = num
            } else {
              this.el.querySelector('.count').innerHTML = '评论(<span class="num">1</span>)'
            }
            insertDom(ret)

            defaultComment['mail'] &&
              signUp({
                username: defaultComment['nick'],
                mail: defaultComment['mail']
              })

            submitBtn.removeAttribute('disabled')
            this.loading.hide()
            reset()
          } catch (error) {
            console.log(error)
          }
        })
        .catch(ex => {
          this.loading.hide()
          this.throw(ex)
        })
    }

    let signUp = o => {
      let u = new this.v.User()
      u.setUsername(o.username)
      u.setPassword(o.mail)
      u.setEmail(o.mail)
      u.setACL(getAcl())
      return u.signUp()
    }

    // at event
    let bindAtEvt = el => {
      Event.on('click', el, e => {
        let at = el.getAttribute('at')
        let rid = el.getAttribute('rid')
        let rmail = el.getAttribute('mail')
        atData['at'] = at
        atData['rmail'] = rmail
        defaultComment['rid'] = rid
        inputs['comment'].value = `${at} `
        inputs['comment'].focus()
      })
    }

    Event.off('click', submitBtn, submitEvt)
    Event.on('click', submitBtn, submitEvt)
  }
}

module.exports = Hitalk
