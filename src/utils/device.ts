export const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return /mobile|android|iphone|ipod/.test(userAgent)
}

export const isIpad = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isModernIpad = navigator?.platform === 'iPad' || navigator?.platform === 'MacIntel'// 使用 userAgentData 判斷
  return userAgent.includes('ipad') && isModernIpad && (userAgent.includes('mac') && navigator.maxTouchPoints > 1) // 判斷觸控 macOS
}
