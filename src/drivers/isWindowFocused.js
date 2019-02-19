
let isWindowFocused = document.hasFocus()
const onWindowFocus = () => isWindowFocused = true
const onWindowBlur = () => isWindowFocused = false
window.addEventListener('focus', onWindowFocus)
window.addEventListener('blur', onWindowBlur)

export default () => isWindowFocused