import { BasicTimedFrame, ComplexTimedFrame, TimedFrame } from "./AnimationFrame";
import { ADInterface } from "../Danmaku/ADInterface";
import { StateData } from "./StateData";
import { getEndValue, getTweenValue } from "../utils/getAnimationAttributeValue";
import { ADItem } from "../Danmaku/ADItem";

let animatedAttributes = new Set<keyof StateData>([
  "x",
  "y",
  "z",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scaleX",
  "scaleY",
  "scaleZ",
  "opacity",
]);

export class AnimationCompute {
  getValue(d: ADItem, time: number) {
    let state = this.getState(d.data)
    if (d.data.animations) {
      // 有动画信息，读取动画
      let animations = d.data.animations;
      for (let frame of animations) {
        let result = this.readAnimation(frame, state, time)
        if (result[0]) {
          return Object.assign(state, result[1])
        } else {
          Object.assign(state, result[1])
        }
      }
    } 
    return state
  }
  /** 读取基本动画 */
  protected readBasicAnimation(frame: BasicTimedFrame, state: Required<StateData>, time: number): [boolean, StateData] {
    if (time > frame.end) {
      let stateChange: StateData = {}
      // 如果动画已结束，则获取结束时的状态
      for (let key in frame) {
        let attrName = key as keyof StateData
        if (animatedAttributes.has(attrName))
        stateChange[attrName] = getEndValue(frame[attrName]!)
      }
      return [false, stateChange]
    } else {
      let tweenTime = this.getTweenTime(time, frame.start, frame.duration, frame.loop)
      let duration = frame.duration
      // 如果动画正在进行，则计算并返回当前值
      let computed: StateData = {}
      for (let key in frame) {
        let attrName = key as keyof StateData
        if (animatedAttributes.has(attrName)) {
          let [a, b] = getTweenValue(frame[attrName]!, state[attrName])
          // 获取进度
          let per = duration ? tweenTime / duration : 1
          // 获取计算值
          computed[attrName] = a + (b - a) * per
        }
      }
      return [true, computed]
    }
  }
  /** 读取列表动画 */
  protected readListAnimation(frame: ComplexTimedFrame, state: Required<StateData>, time: number): [boolean, StateData] {
    let stateChange: StateData = {}
    let tweenTime = this.getTweenTime(time, frame.start, frame.duration, frame.loop)
    for (let item of frame.animations) {
      let subFrame = item as TimedFrame
      let result = this.readAnimation(subFrame, state, tweenTime)
      if (result[0]) {
        // 动画正在进行，返回总计算值
        return [true, Object.assign(stateChange, result[1])]
      } else {
        // 动画已结束，添加到总状态变化
        stateChange = Object.assign(stateChange, result[1])
      }
    }
    // 所有动画已结束，返回结束时的总状态变化
    return [false, stateChange]
  }
  /** 读取组动画 */
  protected readGroupAnimation(frame: ComplexTimedFrame, state: Required<StateData>, time: number): [boolean, StateData] {
    let computed: StateData = {}
    let flag = false
    let tweenTime = this.getTweenTime(time, frame.start, frame.duration, frame.loop)
    for (let item of frame.animations) {
      let subFrame = item as TimedFrame
      let result = this.readAnimation(subFrame, state, tweenTime)
      if (result[0]) {
        // 将组动画标记为正在进行
        flag = true
      }
      // 将结果添加到总计算值
      computed = Object.assign(computed, result[1])
    }
    // 返回总计算值
    return [flag, computed]

  }
  protected readAnimation(frame: TimedFrame, state: Required<StateData>, time: number): [boolean, StateData] {
    switch (frame.type) {
      case "group":
        return this.readGroupAnimation(frame, state, time)
      case "list":
        return this.readListAnimation(frame, state, time)
      default:
        return this.readBasicAnimation(frame, state, time)
    }
  }
  /** 获取动画时间 */
  protected getTweenTime(time: number, start: number, duration: number, loop?: number) {
    return loop ? (time - start) % duration : time - start
  }
  getState(d: ADInterface): Required<StateData> {
    let {
      x,
      y,
      z,
      rotateX,
      rotateY,
      rotateZ,
      scaleX,
      scaleY,
      scaleZ,
      opacity,
    } = d;
    return {
      x: x || 0,
      y: y || 0,
      z: z || 0,
      rotateX: rotateX || 0,
      rotateY: rotateY || 0,
      rotateZ: rotateZ || 0,
      scaleX: scaleX == undefined ? 1 : scaleX,
      scaleY: scaleY == undefined ? 1 : scaleY,
      scaleZ: scaleZ == undefined ? 1 : scaleZ,
      opacity: opacity == undefined ? 1 : opacity,
    }
  }
}
