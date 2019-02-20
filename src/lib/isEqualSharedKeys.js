
import isEqualWith from 'lodash.isequalwith'

/*
 * Checks if 2 objects are deep equal, only on shared keys.
 */

function isEqualWithEnhanced(obj1, obj2) {
  return isEqualWith(obj1, obj2, isEqualSharedKeys)
}

function isEqualSharedKeys(obj1, obj2) {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    return Object.keys(obj1).every(k => {
      if (obj2[k] === undefined) {
        return true
      }

      return isEqualWithEnhanced(obj1[k], obj2[k])
    })
  }

  return undefined
}

export default isEqualWithEnhanced
