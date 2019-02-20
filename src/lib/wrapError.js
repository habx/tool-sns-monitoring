
export default function wrapError(fn, argsToErrorString) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (e) {
      const errorString = argsToErrorString(...args)
      const newE = new Error(errorString)
      newE.name = newE.name + ': ' + newE.name
      newE.message = newE.message + ': ' + e.message
      newE.stack = `${errorString}\n${e.stack}`
      throw newE
    }
  }
}
