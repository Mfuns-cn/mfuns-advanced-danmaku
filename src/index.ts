import { Controller } from "./Controller";
import { InitConfigInterface } from "./InitConfigInterface";
import { DanmakuInterface } from "./Danmaku/DanmakuInterface";

export class MfunsAdvancedDanmaku{
  /** 弹幕获取函数, 弹幕引擎通过调用该函数拉取弹幕 */
  public getDanmaku: () => DanmakuInterface[];
  /** 控制器 */
  public controller: Controller;
  protected autoResize: Boolean;
  constructor(config: InitConfigInterface) {
    this.controller = new Controller({
      stageSize: config.stageSize || [1920, 1080],
      container: config.container
    });
    this.getDanmaku = config.getDanmaku || (() => {return []})
    // 添加弹幕
    this.autoResize = config.autoResize == undefined ? true : config.autoResize
    if (config.getDanmaku) {
      this.controller.loadDanmaku(this.getDanmaku())
    }
    if (this.autoResize) {
      // 监听大小变化
      window.addEventListener("resize", () => {
        this.controller.stage.resize()
      });
    }
  }

  /**
   * 播放
   */
  public play() {
    this.controller.play();
  }
  /**
   * 暂停
   */
  public pause() {
    this.controller.pause();
  }
  /**
   * 跳转
   */
  public seek(time: number) {
    this.controller.seek(time);
  }
  /**
   * 当前时间
   * @returns number
   */
  public time() {
    return this.controller.getTime();
  }
  /**
   * 重置弹幕舞台尺寸
   */
  public resize() {
    this.controller.stage.resize();
  }
  /**
   * 重新加载弹幕
   */
  public reload() {
    this.controller.clearDanmaku()    // 清空弹幕
    this.controller.loadDanmaku(this.getDanmaku())    // 加载弹幕
    this.controller.refresh()     // 刷新
  }
  /**
   * 重置引擎
   */
  public reset() {
    this.controller.reset()     // 清空重置
    this.controller.loadDanmaku(this.getDanmaku())    // 加载弹幕
    this.controller.refresh()     // 刷新
  }
  /**
   * 添加一条弹幕
   */
  public addDanmaku(d: DanmakuInterface) {
    this.controller.addDanmaku(d);
  }
  /**
   * 播放一条弹幕(不添加到时间轴)
   */
  public playDanmaku(d: DanmakuInterface) {
    this.controller.playDanmaku(d)
  }
  /**
   * 添加事件监听
   * @param event
   * @param callback
   */
  /**
    public on(event: DanmakuEventType, callback: (data: any) => void) {
      DanmakuEvent.listener(event, callback);
    } */
}
