import { BasicAnimationFrame, ComplexAnimationFrame, AnimationFrame, ComplexTimedFrame, BasicTimedFrame } from "./AnimationFrame";
import { ADInterface } from "../Danmaku/ADInterface";

export class AnimationParser {
  /** 读取动画列表 */
  public readAnimations(danmaku: ADInterface) {
    if (!danmaku.animations) {
      return;
    }
    /** 初始化时间 */
    let time: number = 0;
    /** 遍历动画列表 */
    danmaku.animations.forEach((frame) => {
      let timedFrame = this.readFrame(frame, time);
      // 将时间更新为动画帧的结束时间
      time = timedFrame.end;
    });
  }
  /** 读取基本动画帧 */
  protected readBasicFrame(
    frame: BasicAnimationFrame,
    start: number
  ) {
    let timedFrame = frame as BasicTimedFrame
    timedFrame.start = start
    timedFrame.duration = (frame.duration || 0)
    timedFrame.end = start + (frame.duration || 0) * (frame.loop || 1)
    // 处理结束后，返回动作信息
    return timedFrame;
  }
  /** 读取组动画帧 */
  protected readGroupFrame(
    frame: ComplexAnimationFrame,
    start: number
  ) {
    let timedFrame = frame as ComplexTimedFrame
    let duration = 0;
    let loop = frame.loop;
    frame.animations.forEach((frame) => {
      // 传入组动画开始时间
      let subFrame = this.readFrame(frame, 0);
      // 持续时间选取组动画的最长时间
      let t = subFrame.duration * (subFrame.loop || 1);
      duration = t > duration ? t : duration;
    });
    timedFrame.start = start
    timedFrame.duration = duration
    timedFrame.end = start + duration * (loop || 1)
    return timedFrame
  }
  /** 读取列表动画帧 */
  protected readListFrame(
    frame: ComplexAnimationFrame,
    start: number
  ) {
    let timedFrame = frame as ComplexTimedFrame
    let duration = 0;
    let loop = frame.loop;
    frame.animations.forEach((frame) => {
      // 传入列表动画当前时间
      let subFrame = this.readFrame(frame, duration);
      // 持续时间添加到列表动画的持续时间
      duration += subFrame.duration * (subFrame.loop || 1);
    });
    timedFrame.start = start
    timedFrame.duration = duration
    timedFrame.end = start + duration * (loop || 1)
    return timedFrame
  }
  /** 读取动画帧 */
  protected readFrame(frame: AnimationFrame, start: number) {
    switch (frame.type) {
      case "group":
        return this.readGroupFrame(frame, start);
      case "list":
        return this.readListFrame(frame, start);
      default:
        return this.readBasicFrame(frame, start);
    }
  }
}
