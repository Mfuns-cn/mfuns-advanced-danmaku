import AnimationAttributeValue from "./AnimationAttributeValue"

export interface BasicAnimationFrame {
  /** 动画类型 */
  type?: "basic";
  /** 用时 */
  duration?: number;
  /** 循环次数 */
  loop?: number
  /** 位移 */
  x?: AnimationAttributeValue;
  y?: AnimationAttributeValue;
  z?: AnimationAttributeValue;
  /** 旋转 */
  rotateX?: AnimationAttributeValue;
  rotateY?: AnimationAttributeValue;
  rotateZ?: AnimationAttributeValue;
  /** 尺寸 */
  scaleX?: AnimationAttributeValue;
  scaleY?: AnimationAttributeValue;
  scaleZ?: AnimationAttributeValue;
  /** 不透明度 */
  opacity?: AnimationAttributeValue;
  /** 速度曲线 */
  easing?: string
}

export interface ComplexAnimationFrame {
  /** 动画类型 */
  type: "group" | "list";
  /** 循环次数 */
  loop?: number
  /** 动画列表 */
  animations: AnimationFrame[],
}

export type AnimationFrame = BasicAnimationFrame | ComplexAnimationFrame 

export type BasicTimedFrame = BasicAnimationFrame & {
  /** 开始时间 */
  start: number,
  /** 结束时间 */
  end: number,
  /** 持续时间 */
  duration: number,
}

export type ComplexTimedFrame = {
  /** 开始时间 */
  start: number,
  /** 结束时间 */
  end: number,
  /** 持续时间 */
  duration: number,
  /** 动画类型 */
  type: "group" | "list";
  /** 循环次数 */
  loop?: number
  /** 动画列表 */
  animations: TimedFrame[],
}

export type TimedFrame = BasicTimedFrame | ComplexTimedFrame 