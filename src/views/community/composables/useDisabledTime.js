export default function useDisabledTime() {
  const nowVaildTime = () => {
    const time = new Date()
    const yy = time.getFullYear()
    const month = time.getMonth()
    const dd = time.getDate()
    const hh = time.getHours() + 2
    const mm = time.getMinutes()
    const ss = time.getSeconds()
    const val = new Date(yy, month, dd, hh, mm)
    return { hh, mm, ss, val }
  }

  const makeRange = (start, end) => {
    const result = []
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result
  }

  const disabledHours = () => makeRange(0, nowVaildTime().hh - 1)

  const disabledMinutes = hour => {
    if (hour === nowVaildTime().hh) {
      return makeRange(0, nowVaildTime().mm - 1)
    }
  }
  const disabledSeconds = (hour, minute) => {
    if (hour === nowVaildTime().hh && minute === nowVaildTime().mm) {
      return makeRange(0, nowVaildTime().ss)
    }
  }
  return {
    nowVaildTime,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
  }
}
