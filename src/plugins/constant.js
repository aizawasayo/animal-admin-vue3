const monthList = [
  { text: '全选', value: '全年' },
  { text: '一月', value: '1月' },
  { text: '二月', value: '2月' },
  { text: '三月', value: '3月' },
  { text: '四月', value: '4月' },
  { text: '五月', value: '5月' },
  { text: '六月', value: '6月' },
  { text: '七月', value: '7月' },
  { text: '八月', value: '8月' },
  { text: '九月', value: '9月' },
  { text: '十月', value: '10月' },
  { text: '十一月', value: '11月' },
  { text: '十二月', value: '12月' },
]
const periodOptions = { start: '01:00', step: '1:00', end: '24:00' }

export default app => {
  app.provide('monthList', monthList)
  app.provide('periodOptions', periodOptions)
}
