import AnimationAttributeValue from "../Animation/AnimationAttributeValue"


export function getStartValue(v: AnimationAttributeValue, stateValue: number) {
  if (Array.isArray(v)) {
    return v[0]
  } else {
    return stateValue
  }
}
/** 获取最终值 */
export function getEndValue(v: AnimationAttributeValue) {
  if (Array.isArray(v)) {
    let b = v[1]
    return (b == undefined ? v[0] : b)
  } else {
    return v
  }
}
/** 获取Tween */
export function getTweenValue(v: AnimationAttributeValue, stateValue: number) {
  if (Array.isArray(v)) {
    let a = v[0]
    let b = v[1]
    return [a, b == undefined ? a : b]
  } else {
    return [stateValue, v]
  }
}