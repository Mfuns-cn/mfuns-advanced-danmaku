import { AnimationCompute } from "../Animation/AnimationCompute";
import { StateData } from "../Animation/StateData";
import { ADDataText } from "../Danmaku/ADData";
import { ADItem } from "../Danmaku/ADItem";

const animationCompute = new AnimationCompute();

export class StageDanmaku {
  danmaku: ADItem;
  el: HTMLElement;
  /** 弹幕状态：1: 未开始 | 2: 播放中 | 3: 已结束 */
  status: 0 | 1 | 2 | 3;
  animated: boolean
  constructor(danmaku: ADItem) {
    this.danmaku = danmaku
    this.animated = Boolean(this.danmaku.data.animations)
    this.el = this.createDOM();
    this.updateDOM(animationCompute.getState(this.danmaku.data))
  }
  /** 初始化DOM元素 */
  private createDOM() {
    const data = this.danmaku.data as ADDataText;
    // 创建容器元素
    let container = document.createElement("div");
    container.classList.add("mfuns-advanced-danmaku-item");
    container.setAttribute("data-id", String(this.danmaku.id));
    container.style.position = "absolute";
    container.style.display = "inline-block";
    container.style.transformOrigin = "left top";
    container.style.zIndex = (data.layer || 0).toString()
    if (!data.type || data.type == "text") {
      // 创建内容元素
      let content = document.createElement("div");
      content.classList.add("pos-danmaku-item-content");
      content.innerHTML = data.content || "";
      content.style.whiteSpace = "pre";
      content.style.transform = data.anchor
        ? `translate(${-data.anchor[0] * 100}%, ${-data.anchor[1] * 100}%)`
        : "";
      // 设置基本样式
      content.style.fontSize = data.size + "px";
      content.style.color = data.color || "#FFFFFF";
      content.style.fontWeight = data.bold ? "700" : "400";
      content.style.fontFamily = data.font || "SimHei";
      // 添加到容器
      container.appendChild(content);
    }
    return container;
  }
  /** 根据弹幕属性更新DOM元素 */
  private updateDOM(state: Required<StateData>) {
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
    } = state;
    // 设置变换和不透明度
    this.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale3d(${scaleX}, ${scaleY}, ${scaleZ})`
    this.el.style.opacity = opacity.toString()
  }
  /** 根据当前时间绘制弹幕 */
  public draw(time: number) {
    if (time < this.danmaku.start) {
      // 当前时间未达到弹幕开始时间，隐藏弹幕
      if (this.status != 1) {
        this.status = 1;
        this.el.style.display = "none";
      }
    } else if (time <= this.danmaku.end) {
      // 当前时间在弹幕存活时间段内，显示弹幕
      if (this.status != 2) {
        this.status = 2;
        this.el.style.display = "";
      }
      if (!this.animated) {
        // 如果弹幕没有设置动画，则直接返回
        return 2
      }
      // 更新DOM
      let result = animationCompute.getValue(this.danmaku, time - this.danmaku.start);
      this.updateDOM(result);
    } else {
      // 当前时间已超过弹幕结束时间，隐藏弹幕
      if (this.status != 3) {
        this.status = 3;
        this.el.style.display = "none";
      }
    }
    return this.status;
  }
}
