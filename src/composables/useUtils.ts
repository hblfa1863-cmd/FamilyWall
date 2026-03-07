export function useUtils() {
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return formatDate(dateStr)
  }

  function getAvatarColor(name: string): string {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-green-400 to-emerald-500',
      'from-blue-400 to-cyan-500',
      'from-purple-400 to-pink-500',
      'from-rose-400 to-red-500',
      'from-teal-400 to-cyan-500',
    ]
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  function getMonthEmoji(month: number): string {
    const emojis = ['🥶', '❄️', '🌸', '🌿', '🌧️', '☀️', '🌞', '🏖️', '🍂', '🍁', '🌨️', '🎄']
    return emojis[month]
  }

  function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }

  function throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        fn(...args)
      }
    }
  }

  function copyToClipboard(text: string): Promise<boolean> {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => {
        // Fallback
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textarea)
        return success
      })
  }

  return {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    getAvatarColor,
    getMonthEmoji,
    debounce,
    throttle,
    copyToClipboard
  }
}
