import { ADItem } from "../Danmaku/ADItem";
import { ShortSegLine } from "./ShortSegLine";
import { LongSegLine } from "./LongSegLine";

/** 弹幕时间轴 */

export class Timeline {
  /** 短段时间轴 */
  public shortSegLine: ShortSegLine;
  /** 长段时间轴 */
  public longSegLine: LongSegLine;

  constructor() {
    this.shortSegLine = new ShortSegLine();
    this.longSegLine = new LongSegLine();
  }
  /** 获取下一秒段的弹幕数据 */
  public getNextList(s: number) {
    return this.shortSegLine.getSegList(s + 1); // 在到达s秒的时候提前获取s+1秒段的弹幕，是为了减少命令执行延迟带来的影响
  }
  /** 获取seek后的弹幕数据
   * 包括当前秒段及下一秒段弹幕、该秒段前60秒段所有未结束弹幕、当前长段未结束弹幕 */
  public getSeekList(time: number) {
    let s = Math.floor(time / 1000);
    let currentSeg = this.shortSegLine.getSegList(s);
    let nextSeg = this.shortSegLine.getSegList(s + 1);
    let beforeDanmakuList = this.getBeforeDanmaku(time);
    let longDanmakuList = this.getLongDanmaku(time);
    let list: ADItem[] = [];
    list = list.concat(longDanmakuList, beforeDanmakuList, currentSeg, nextSeg);
    return list;
  }
  /** 获取该秒段之前60个秒段的未结束弹幕数据 */
  private getBeforeDanmaku(time: number) {
    let s = Math.floor(time / 1000);
    let list: ADItem[] = [];
    for (let t = s < 60 ? 0 : s - 60; t < s; t++) {
      let seg = this.shortSegLine.list[t];
      seg?.forEach((dan) => {
        if (dan.end > time) {
          list.push(dan);
        }
      });
    }
    return list;
  }
  /** 获取该长段中未结束弹幕(开始时间早于所在时间秒段的60个秒段之前) */
  private getLongDanmaku(time: number): ADItem[] {
    let s = Math.floor(time / 1000);
    let m = Math.floor(time / 60000);
    let list: ADItem[] = [];
    let seg = this.longSegLine.list[m];
    seg?.forEach((dan) => {
      if (dan.start < (s - 60) * 1000 && dan.end > time) {
        list.push(dan);
      }
    });
    return list;
  }

  /** 清空时间轴 */
  public clear() {
    this.shortSegLine.clear();
    this.longSegLine.clear();
  }
  /** 从列表中添加弹幕 */
  public addFromList(list: ADItem[]) {
    list.forEach((dan) => {
      this.add(dan);
    });
  }
  /** 添加弹幕到时间轴 */
  public add(dan: ADItem) {
    this.shortSegLine.add(dan);
    // 如果时间大于60s=60000ms, 则算作长弹幕, 加入长段时间轴中
    if (dan.duration > 60000) {
      this.longSegLine.add(dan);
    }
  }
  /** 移除时间轴上的某条弹幕 */
  public remove(dan: ADItem) {
    this.shortSegLine.remove(dan);
    if (dan.duration > 60000) {
      this.longSegLine.remove(dan);
    }
  }
}
