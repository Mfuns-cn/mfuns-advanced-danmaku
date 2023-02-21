import { ADItem } from "../Danmaku/ADItem";
import { StageDanmaku } from "./StageDanmaku";
// import { Renderer } from "./Renderer/Renderer";

/**
 * 舞台对象
 */
export class Stage {
  /** 舞台样式表 */
  protected stylesheet: HTMLStyleElement;
  /** 舞台容器 */
  readonly container: HTMLElement;
  /** 舞台本体 */
  readonly el: HTMLElement;
  /** 舞台尺寸 */
  readonly size: [number, number];
  /** 视点与舞台的距离 */
  readonly perspective: number;
  /** 缩放比例 */
  protected scale: number;
  /** 时间获取函数 */
  readonly getTime: () => number;
  /** 舞台弹幕列表 */
  protected list: StageDanmaku[] = [];
  /** 暂停状态 */
  protected paused: boolean = true;
  protected timer: number = 0;
  //** 渲染器 */
  // public renderer: Renderer;
  constructor({
    container,
    size,
    perspective,
    getTime,
  }: {
    container: HTMLElement;
    size?: [number, number];
    perspective?: number;
    getTime: () => number;
  }) {
    this.container = container;
    this.size = size || [1920, 1080];
    this.perspective = perspective || this.size[0];
    this.scale = 1;
    this.getTime = getTime;
    // 创建舞台
    this.el = document.createElement("div");
    this.el.classList.add("mfuns-advanced-danmaku-stage");
    this.el.style.width = this.size[0] + "px";
    this.el.style.height = this.size[1] + "px";
    this.el.style.position = "absolute";
    this.el.style.transformOrigin = "left top";
    this.el.style.transformStyle = "preserve-3d"; // 启用3D效果
    this.el.style.perspective = this.perspective + "px"; // 视点与弹幕舞台距离
    this.container.appendChild(this.el);

    this.resize();

    this.stylesheet = document.createElement("style");
    this.stylesheet.innerText +=
      ".mfuns-advanced-danmaku-stage.paused .mfuns-advanced-danmaku-item { animation-play-state: paused }";
    this.stylesheet.innerText +=
      ".mfuns-advanced-danmaku-item.mfuns-advanced-danmaku-invisible { visibility: hidden }";
    this.stylesheet.innerText +=
      ".mfuns-advanced-danmaku-item-content { -webkit-text-size-adjust: none; text-size-adjust: none}";
    this.container.appendChild(this.stylesheet);

    // this.renderer = new Renderer(this.size)

    this.pause(); // 实例创建后设为暂停状态
  }
  /** 从列表中添加弹幕 */
  public addFromList(list: ADItem[]) {
    list.forEach((dan) => {
      this.add(dan);
    });
  }
  /** 添加一条弹幕 */
  public add(dan: ADItem) {
    // 检测弹幕是否早已结束
    if (dan.end > this.getTime()) {
      // 将弹幕添加到列表并挂载到舞台上
      let d = new StageDanmaku(dan);
      this.list.push(d);
      this.el.appendChild(d.el);
    } else {
      console.log(`弹幕已结束: id-${dan.id} ${dan.end} < ${this.getTime()}`);
    }
  }
  /** 根据id删除弹幕元素 */
  public removeById(id: number | string) {
    this.list = this.list.filter((item) => {
      if (item.danmaku.id == id) {
        item.el.remove();
        return false;
      } else {
        return true;
      }
    });
  }
  /** 清空舞台 */
  public clear() {
    this.el.innerHTML = "";
    this.list = [];
  }
  /** 播放 */
  public play() {
    if (!this.paused) return
    this.paused = false
    this.timer = window.requestAnimationFrame(() => {
      this.refreshHandler();
    });
  }
  // 舞台刷新处理
  private refreshHandler() {
    if (this.paused) return
    this.update();
    window.requestAnimationFrame(() => {
      this.refreshHandler();
    });
  }
  // 舞台内容更新
  public update() {
    let time = this.getTime();
    this.list.forEach((dm) => {
      let status = dm.draw(time);
      if (status == 3) {
        this.list.splice(this.list.indexOf(dm), 1)
        dm.el.remove()
      }
    });
  }
  /** 暂停 */
  public pause() {
    this.paused = true
  }
  /** 更新尺寸 */
  public resize() {
    let { width, height } = this.container.getBoundingClientRect();
    if (width / this.size[0] < height / this.size[1]) {
      // 宽占满
      this.scale = width / this.size[0];
      this.el.style.transform = `scale(${width / this.size[0]}, ${
        width / this.size[0]
      })`;
      this.el.style.left = "0px";
      this.el.style.top = (height - this.size[1] * this.scale) / 2 + "px";
    } else {
      // 高占满
      this.scale = height / this.size[1];
      this.el.style.transform = `scale(${height / this.size[1]}, ${
        height / this.size[1]
      })`;
      this.el.style.left = (width - this.size[0] * this.scale) / 2 + "px";
      this.el.style.top = "0px";
    }
  }
}
