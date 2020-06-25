/*
 * @Author: Ihoey
 * @Email: mail@ihoey.com
 * @Date: 2020-06-25 17:02:34
 * @LastEditors: Ihoey
 * @LastEditTime: 2020-06-25 17:05:52
 */

const HtmlUtil = {
  /**
   * HTML转码
   * @param {String} str
   * @return {String} result
   */
  encode(str) {
    return !!str
      ? str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/ /g, '&nbsp;')
          .replace(/\'/g, '&#39;')
          .replace(/\"/g, '&quot;')
      : ''
  },
  /**
   * HTML解码
   * @param {String} str
   * @return {String} result
   */
  decode(str) {
    return !!str
      ? str
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
      : ''
  }
}

const dateFormat = date => {
  const vDay = padWithZeros(date.getDate(), 2)
  const vMonth = padWithZeros(date.getMonth() + 1, 2)
  const vYear = padWithZeros(date.getFullYear(), 2)
  return `${vYear}-${vMonth}-${vDay}`
}

const timeAgo = date => {
  try {
    const oldTime = date.getTime()
    const currTime = new Date().getTime()
    const diffValue = currTime - oldTime

    const days = Math.floor(diffValue / (24 * 3600 * 1000))
    if (days === 0) {
      //计算相差小时数
      const leave1 = diffValue % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000))
      if (hours === 0) {
        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000))
        if (minutes === 0) {
          //计算相差秒数
          const leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
          const seconds = Math.round(leave3 / 1000)
          return seconds + ' 秒前'
        }
        return minutes + ' 分钟前'
      }
      return hours + ' 小时前'
    }
    if (days < 0) return '刚刚'

    if (days < 8) {
      return days + ' 天前'
    } else {
      return dateFormat(date)
    }
  } catch (error) {
    console.log(error)
  }
}

const padWithZeros = (vNumber, width) => {
  let numAsString = vNumber.toString()
  while (numAsString.length < width) {
    numAsString = '0' + numAsString
  }
  return numAsString
}

const Event = {
  on(type, el, handler, capture) {
    if (el.addEventListener) el.addEventListener(type, handler, capture || false)
    else if (el.attachEvent) el.attachEvent(`on${type}`, handler)
    else el[`on${type}`] = handler
  },
  off(type, el, handler, capture) {
    if (el.removeEventListener) el.removeEventListener(type, handler, capture || false)
    else if (el.detachEvent) el.detachEvent(`on${type}`, handler)
    else el[`on${type}`] = null
  }
}

const getLink = target => {
  return target.link || (target.mail && `mailto:${target.mail}`) || 'javascript:void(0);'
}

const check = {
  mail(m) {
    return {
      k: /[\w-\.]+@([\w-]+\.)+[a-z]{2,3}/.test(m),
      v: m
    }
  },
  link(l) {
    l = l.length > 0 && (/^(http|https)/.test(l) ? l : `http://${l}`)
    return {
      k: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(l),
      v: l
    }
  }
}

export { HtmlUtil, Event, check, getLink, dateFormat, timeAgo }
