import { AnimationFrame } from "../Animation/AnimationFrame"

/** 播放器弹幕接口 */
export interface ADInterface {
  /** 类型 */
  type?: string
  /** 内容 */
  content?: string
  /** 引用id(仅在弹幕组内有效) */
  id?: string
  /** 位置 */
  x?: number
  y?: number
  z?: number
  /** 旋转 */
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  /** 缩放比例 */
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  /** 不透明度 */
  opacity?: number
  /** 锚点 */
  anchor?: [number, number]
  /** 层级 */
  layer?: number
  /** 存活时间 */
  duration?: number
  /** 舞台相对尺寸 */
  stage?: number | [number, number]
  /** 开始时间 */
  start?: number
  /** 在被引用的弹幕结束之后播放，覆盖start */
  then?: string
  /** 延迟播放时间 */
  delay?: number
  /** 继承 */
  extend?: string
  /** 样式 */
  style?: object
  /** 动画 */
  animations?: AnimationFrame[]
}
