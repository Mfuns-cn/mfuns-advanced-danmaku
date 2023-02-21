import { ADItem } from "./ADItem";
import { DanmakuInterface } from "./DanmakuInterface";
import { AnimationParser } from "../Animation/AnimationParser";
import { ADData } from "./ADData";
import * as JSON5 from "json5"
import { ADInterface } from "./ADInterface";

/**
 * 弹幕转换器
 * 将弹幕字符串转换为高级弹幕对象
 */

export class DanmakuParser {
  animationParser = new AnimationParser()
  public parse(d: DanmakuInterface): ADItem[] {
    /** 转换单条弹幕 */
    try {
      let data: ADInterface = JSON5.parse(d.content);
      if (Array.isArray(data)) {
        return this.readListDanmaku(d, data)
      } else {
        return [this.readSingleDanmaku(d, data)]
      }
    } catch (error) {
      console.log(`弹幕格式错误-id:${d.id}`);
      return[]
    }
  }
  /** 读取单条弹幕 */
  private readSingleDanmaku(d: DanmakuInterface, data: ADInterface) {
      let id: number | string | null = d.id || null;
      let start: number = (data["start"] || 0) + (d.time || 0);
      // 读取动画帧，添加属性
      this.animationParser.readAnimations(data)
      // 包装弹幕
      let danmakuData = new ADItem(data as ADData, start, id)
      return danmakuData;
  }
  /** 读取弹幕组 */
  private readListDanmaku(d: DanmakuInterface, list: ADInterface[]) {
    let dmList: ADItem[] = []
    let idMap = new Map<string, ADItem>()
    list.forEach(data => {
      let id: number | string | null = d.id || null;
      let qid: string | undefined = data.id   // 引用id
      // 继承属性
      let extend = idMap.get(data.extend!)
      if (extend) {
        data = Object.assign(JSON.parse(JSON.stringify(extend.data)), {id: null}, data)
      }
      let then = idMap.get(data.then!)        // then引用
      let delay = data.delay || 0             // 延迟时间
      // 实际开始时间(不含delay)
      let start: number = then ? then.end : (data["start"] || 0) + (d.time || 0);
      // 读取动画帧，添加属性
      this.animationParser.readAnimations(data)
      // 包装弹幕
      let danmakuData = new ADItem(data as ADData, start + delay, id)
      dmList.push(danmakuData)
      // 设置引用id
      qid && idMap.set(qid, danmakuData)
      idMap.set("$last", danmakuData)
    })
    return dmList
  }
  /** 获得一条弹幕的持续时间 */
  public getDuration(danmaku: ADData) {
    let animations = danmaku.animations
    return danmaku.duration || animations?.[animations.length - 1].end || 0;
  }
}
