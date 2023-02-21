/** 播放器弹幕接口 */

export interface DanmakuInterface {
  /** 弹幕内容 */
  content: string;
  /** 弹幕id, 具有唯一性, 用于播放器的弹幕操作 */
  id?: number | string;
  /** 开始时间, 若弹幕内容中无时间信息则使用该属性 */
  time?: number;
}
