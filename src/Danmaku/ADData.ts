import { TimedFrame } from "../Animation/AnimationFrame";
import { ADInterface } from "./ADInterface";

/** 弹幕数据 */

export interface ADData extends ADInterface {
  animations?: TimedFrame[]
}

export interface ADDataText extends ADData {
  type?: "text"
  content?: string
  size?: number
  font?: string
  bold?: boolean
  color?: string
}
