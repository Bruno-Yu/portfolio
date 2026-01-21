import { useEffect, useState } from 'react'
import { getResponsiveValue } from '@/utils/index'

/**
 * 自定義 Hook 用於獲取響應式值
 * @param {Object} breakpoints - 斷點配置對象
 * @returns {[*, number]} 返回一個數組，包含當前的響應式值和視窗寬度
 */
export const useResponsiveValue = (breakpoints) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 初始調用以設置初始值

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const responsiveValue = getResponsiveValue(breakpoints, windowWidth)

  return [responsiveValue, windowWidth]
}
