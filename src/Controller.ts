
/**
 * 控制器, 控制高级弹幕的处理与渲染流程
 * */

import { DanmakuInterface } from "./Danmaku/DanmakuInterface";
import { DanmakuParser } from "./Danmaku/DanmakuParser";
import { Stage } from "./Stage/Stage";
import { Timeline } from "./Timeline/Timeline";
import { TimelineDriver } from "./Timeline/TimelineDriver";

export class Controller {
  /** 弹幕容器 */
  protected container: HTMLElement;
  /** 播放时时长, 暂停时为当前时长, 播放时为开始播放时的时长 */
  protected playTime: number = 0;
  /** 起始时间戳(播放时时间戳 - 播放时时长), 用于计算播放时间, 暂停时为0 */
  protected startStamp: number = 0;
  /** 暂停状态 */
  protected isPaused: boolean = true;
  /** 间隔定时器 */
  protected intervalTimer: number;
  /** 弹幕数据转换模块 */
  public danmakuParser: DanmakuParser;
  /** 时间轴模块, 用于分段存取弹幕 */
  public timeline: Timeline;
  /** 时间轴驱动器, 用于控制播放状态及返回弹幕渲染列表 */
  public timelineDriver: TimelineDriver;
  /** 舞台模块, 用于分段存取弹幕 */
  public stage: Stage;

  constructor({
    stageSize,
    container,
  }: {
    stageSize?: [number, number];
    container: HTMLElement;
  }) {
    this.danmakuParser = new DanmakuParser();
    this.timeline = new Timeline();
    this.timelineDriver = new TimelineDriver({
      timeline: this.timeline,
      getTime: () => {
        return this.getTime();
      },
      onCurrentDanmaku: (list) => {
        // 检测到即将产生弹幕时, 扔进舞台模块
        this.stage.addFromList(list || []);
      },
    });
    this.container = container;
    this.stage = new Stage({
      container: this.container,
      size: stageSize,
      getTime: () => {
        return this.getTime();
      },
    });
  }

  /** 获取当前时间 */
  public getTime(): number {
    if (this.isPaused) {
      return this.playTime; // 暂停时获取时间
    } else {
      return Date.now() - this.startStamp; // 播放时获取时间
    }
  }

  /** 加载弹幕 */
  public loadDanmaku(dList: DanmakuInterface[]) {
    dList.forEach((d) => {
      this.addDanmaku(d);
    });
  }
  /** 根据播放器弹幕格式添加弹幕 */
  public addDanmaku(d: DanmakuInterface) {
    let dan = this.danmakuParser.parse(d);
    dan && this.timeline.addFromList(dan);
  }
  /** 根据播放器弹幕格式直接播放一条预览弹幕 */
  public playDanmaku(d: DanmakuInterface) {
    let dan = this.danmakuParser.parse(d);
    dan && this.stage.addFromList(dan)  // 不需要放进时间轴, 直接以播放形式放进舞台
  }
  /** 根据id删除弹幕 */
  // public removeDanmaku() {}
  /** 播放 */
  public play() {
    if (this.isPaused) {
      this.isPaused = false;
      this.startStamp = Date.now() - this.playTime;
      this.stage.play()           // 舞台设为播放状态
      this.timelineDriver.play()  // 时间轴播放
    }
  }
  /** 暂停 */
  public pause() {
    if (!this.isPaused) {
      this.isPaused = true;
      this.playTime = Date.now() - this.startStamp; // 设定当前时间
      this.startStamp = 0;
      this.stage.pause()          // 舞台设为暂停状态
      this.timelineDriver.pause() // 时间轴暂停
    }
  }
  /** 跳转 */
  public seek(time: number) {
    this.playTime = time; // 设定当前时间
    if (!this.isPaused) {
      this.startStamp = Date.now() - this.playTime; // 重新获取起始时间戳
    }
    this.refresh()    // 刷新弹幕
  }
  /** 刷新 */
  public refresh() {
    let list = this.timelineDriver.seek();  // 时间轴跳转, 重新获取弹幕内容
    this.stage.clear();             // 清空舞台
    this.stage.addFromList(list);   // 将重新获取的弹幕内容添加到舞台
  }
  /** 清空弹幕 */
  public clearDanmaku() {
    this.timeline.clear() // 清空时间轴
    this.stage.clear()    // 清空舞台
  }
  /** 重置 */
  public reset() {
    this.pause()          // 暂停
    this.timeline.clear() // 清空时间轴
    this.seek(0)          // 跳转至原点(同时清空舞台并复位时间轴)
  }
}
