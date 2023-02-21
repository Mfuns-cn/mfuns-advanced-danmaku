import { ADItem } from "../Danmaku/ADItem"

/**
 * 短段时间轴
 * 以1s=1000ms为一个短段
 */

export class ShortSegLine {
  /** 列表 */
  public list: Array<ADItem[]>
  constructor() {
    this.list = []
  }
  /** 添加一条弹幕 */
  public add(dan: ADItem) {
    let s = Math.floor(dan.start / 1000)  // 获取开始时所在的秒段
    this.listAdd(s, dan)      // 将弹幕添加进对应的秒段中
  }
  /** 删除一条弹幕 */
  public remove(dan: ADItem) {
    let s = Math.floor(dan.start / 1000)  // 获取开始时所在的秒段
    let i = this.list[s]?.indexOf(dan)    // 在该秒段内查找弹幕位置并删除
    i && i != -1 && this.list[s]?.splice(i, 1)
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
    this.list[i].push(item)
  }
  private listGet(i:number): ADItem[] {
    return this.list[i] || []
  }
}