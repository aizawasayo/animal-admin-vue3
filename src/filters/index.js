// import parseTime, formatTime and set to filter
import { formatTime, parseTime } from '@utils'

/**
 * 当时间不是 单数 1，则显示 复数 后缀
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * 距离现在过去了多少时间，英文后缀
 * @param {number} time
 */
function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' mintue')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hours')
  }
  return pluralize(~~(between / 86400), ' day')
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      )
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/** 截取字数长度, 常用
 * @param {string} text
 * @param {number} length
 */
function textFilter(text, length) {
  let shortText = text
  const len = length ? length : 20
  if (text && text.length > len) {
    shortText = text.substring(0, len) + '...'
  }
  return shortText
}

export default {
  parseTime,
  formatTime,
  pluralize,
  timeAgo,
  numberFormatter,
  toThousandFilter,
  uppercaseFirst,
  textFilter,
}
