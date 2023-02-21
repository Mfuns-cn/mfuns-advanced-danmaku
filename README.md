# Mfuns 高级弹幕引擎

Mfuns Advanced Danmaku 高级弹幕引擎。

## 特性
支持下列弹幕效果：
* 3D移动及动画
* 3D旋转及动画
* 3D缩放及动画
* 不透明度及动画
* 并行动画
* 串行动画
* 重复动画
* 弹幕属性继承

下列功能还在开发中：
* 弹幕组合
* 图片弹幕
* SVG弹幕
* css样式
* 速度曲线


## 下载 & 安装
### 标签导入
下载 lib/mfuns-advanced-danmaku.js 文件，使用 script 标记导入到 html 中

### 使用 npm 安装
```
npm i mfuns-advanced-danmaku
```
导入方式
```javascript
import { MfunsAdvancedDanmaku } from "mfuns-advanced-danmaku";
```
实例化
```javascript
let advancedDanmaku = new MfunsAdvancedDanmaku(
  // 挂载的DOM容器, 其css样式的position属性须设置为relative/absolute
  container: document.getElementById("advanced-danmaku"),
  // 拉取弹幕列表
  getDanmaku: () => {
    return ([{...}, {...}])
  },
  // 舞台基本尺寸, 可选
  stageSize: [1920, 1080],
  // 窗口大小变化时自动调整舞台大小, 默认值为true
  autoResize: true,
);
```

## 方法
#### play()
播放

#### pause()
暂停

#### seek(```time```:number)
跳转到指定位置(单位ms)

#### time():number
获取弹幕引擎的播放时间，单位为ms

#### reload()
在不重置时间的情况下清空并重新加载弹幕

#### reset()
重置弹幕引擎并重新加载弹幕

#### addDanmaku(danmaku)
添加一条弹幕到时间轴，适用于新增实时弹幕

#### playDanmaku(danmaku)
播放一条弹幕，即直接添加一条弹幕到舞台，适用于弹幕编辑效果预览

#### resize()
根据舞台容器的尺寸调整舞台大小

默认情况下，当浏览器窗口大小变化时，会自动调用resize()方法调整舞台大小

## 数据格式

### 传入的弹幕列表格式
``` json5
[
  {
    "id": 0,  // 弹幕唯一标识id, 可选, 接受数字/字符串格式
    "content": "{...}", // 弹幕JSON字符串
    "time": 0        // 弹幕时间, 可选, 弹幕内容无发送时间设置时将使用该属性替代
  },
  ...
]
```