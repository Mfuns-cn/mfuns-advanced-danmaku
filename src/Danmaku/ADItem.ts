import randomHash from "../utils/randomHash";
import { ADData } from "./ADData"

/** 弹幕操作对象 */
export class ADItem {
  /** 高级弹幕本体 */
  readonly data: ADData
  /** 弹幕id, 具有唯一性 */
  readonly id: number|string|null
  /** 渲染id, 具有随机性和唯一性, 用于弹幕标识和渲染 */
  readonly rid: string
  /** 弹幕开始时间 */
  readonly start: number
  /** 弹幕持续时间 */
  readonly duration: number
  /** 弹幕终止时间 */
  readonly end: number
  /** 弹幕DOM元素 */
  protected el: HTMLElement | null
  /** 弹幕舞台 */
  protected stage: HTMLElement | null
  constructor(data: ADData, start: number, id: number|string|null) {
    this.data = data
    this.start = start
    this.id = id
    this.rid = randomHash(8)
    this.duration = data.duration || data.animations?.[data.animations.length - 1].end || 0;
    this.end = this.start + this.duration
  }
}