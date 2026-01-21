export function getImageUrl(name: string, extension: string = 'png') {
  return new URL(`../assets/images/${name}.${extension}`, import.meta.url).href
}

/**
 * 根據當前螢幕寬度返回對應的斷點值
 * @param {Object} breakpoints - 斷點配置對象
 * @param {number} [currentWidth] - 當前螢幕寬度，如果未提供則自動獲取
 * @returns {*} 對應斷點的值
 */
export const getResponsiveValue = (breakpoints, currentWidth = null) => {
  // 如果沒有提供當前寬度，則獲取視窗寬度
  const width =
    currentWidth || (typeof window !== 'undefined' ? window.innerWidth : 0)

  // 將斷點配置轉換為數組並按寬度降序排序
  const sortedBreakpoints = Object.entries(breakpoints).sort(
    (a, b) => b[0] - a[0]
  )

  // 尋找第一個小於等於當前寬度的斷點
  const matchedBreakpoint = sortedBreakpoints.find(
    ([breakpoint]) => width >= breakpoint
  )

  // 如果找到匹配的斷點，返回其值；否則返回最小斷點的值
  return matchedBreakpoint
    ? matchedBreakpoint[1]
    : sortedBreakpoints[sortedBreakpoints.length - 1][1]
}

/**
 * window.localStorage
 * @method set
 * @method get
 * @method remove
 * @method clear
 */
export const Local = {
  setKey(key: string) {
    // @ts-ignore
    return `${key}`
  },
  set<T>(key: string, val: T) {
    window.localStorage.setItem(Local.setKey(key), JSON.stringify(val))
  },
  get(key: string) {
    let json = <string>window.localStorage.getItem(Local.setKey(key))
    return JSON.parse(json)
  },
  remove(key: string) {
    window.localStorage.removeItem(Local.setKey(key))
  },
  clear() {
    window.localStorage.clear()
  },
}
