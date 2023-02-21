import { ADItem } from "../Danmaku/ADItem"

/**
 * 长段时间轴
 * 以60s=60000ms为一个长段
 */

export class LongSegLine {
  /** 列表 */
  public list: Array<ADItem[]>
  constructor() {
    this.list = []
  }
  /** 添加一条弹幕 */
  public add(dan: ADItem) {
    let startmin = Math.floor(dan.start / 60000)  // 获取开始时所在的分钟段
    let endmin = Math.floor(dan.end / 60000)    // 获取结束时所在的分钟段
    for (let m = startmin; m <= endmin; m++) {
      this.listAdd(m, dan) // 弹幕存在的任何长段都有该弹幕对象的引用
    }
  }
  /** 删除一条弹幕 */
  public remove(dan: ADItem) {
    let startmin = Math.floor(dan.start / 60000)  // 获取开始时所在的分钟段
    let endmin = Math.floor(dan.end / 60000)    // 获取结束时所在的分钟段
    for (let m = startmin; m <= endmin; m++) {  // 在该时段内逐段查找弹幕位置并依次删除
        let i = this.list[m]?.indexOf(dan)
        i && i != -1 && this.list[m]?.splice(i, 1)
    }
  }
  /** 获取一个分段的弹幕 */
  public getSegList(i:number): ADItem[] {
    return this.listGet(i)
  }
  /** 清空时间轴 */
  public clear() {
    this.list = []
  }
  private listAdd(i:number, item:any) {
    if (!this.list[i]) {
      this.list[i] = []
    }
    this.list[i]?.push(item)
  }
  private listGet(i:number): ADItem[] {
    return this.list[i] || []
  }
}