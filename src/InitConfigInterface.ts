import { DanmakuInterface } from "./Danmaku/DanmakuInterface";
/**
 * 初始化配置接口
 */

export interface InitConfigInterface {
    /** 渲染的容器 */
    container: HTMLElement;
    /** 弹幕获取函数, 弹幕引擎通过调用该函数拉取弹幕 */
    getDanmaku?: () => DanmakuInterface[];
    /** 舞台尺寸 */
    stageSize?: [number, number];
    /** 窗口大小变化时自动调整舞台大小 */
    autoResize?: boolean;
}
  