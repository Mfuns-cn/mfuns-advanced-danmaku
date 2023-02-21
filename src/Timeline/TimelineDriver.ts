import { Timeline } from "./Timeline";
import { ADItem } from "../Danmaku/ADItem";

/**
 * 时间轴驱动器
 * 控制时间轴的时间状态, 根据播放状态获取当前时间, 并从时间轴中获取弹幕
 */

export class TimelineDriver {
  /** 时间轴 */
  protected timeline: Timeline;
  /** 定时器(只读), 用于获取当前时间 */
  protected getTime: () => number;
  /** 秒数(弹幕获取时间状态) */
  protected seconds: number;
  /** 毫秒(偏移量) */
  protected milliseconds: number;
  /** 间隔定时器 */
  protected intervalTimer: number;
  /** 延时定时器 */
  protected timeoutTimer: number;
  /** 播放状态 */
  protected isPlaying: boolean = false;
  /** 返回弹幕时需要执行的函数 */
  public onCurrentDanmaku: (result?: ADItem[]) => any;
  constructor({
    timeline,
    getTime,
    onCurrentDanmaku,
  }: {
    timeline: Timeline;
    getTime: () => number;
    onCurrentDanmaku?: (result?: ADItem[]) => any;
  }) {
    this.timeline = timeline;
    this.getTime = getTime;
    this.seconds = 0;
    this.milliseconds = 0;
    this.onCurrentDanmaku = onCurrentDanmaku || (() => {});
  }
  /** 时间轴跳转 */
  public seek() {
    let time = this.getTime();
    this.seconds = Math.floor(time / 1000);
    this.milliseconds = time % 1000;
    return this.timeline.getSeekList(time);
  }
  /** 播放 */
  public play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.timeoutTimer = window.setTimeout(() => {
        this.seconds++; // 等待至该秒结束, 进入下一秒段
        this.intervalTimer = window.setInterval(() => {
          this.emitCurrentDanmaku(this.timeline.getNextList(this.seconds));
          this.seconds++;
        }, 1000);
        this.milliseconds = 0;
        window.clearTimeout(this.timeoutTimer);
      }, 1000 - this.milliseconds);
    }
  }
  /** 暂停 */
  public pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      window.clearTimeout(this.timeoutTimer);
      window.clearInterval(this.intervalTimer);
      this.milliseconds = this.getTime() - this.seconds * 1000;
    }
  }
  private emitCurrentDanmaku(list: ADItem[]) {
    this.onCurrentDanmaku(list);
  }
}
