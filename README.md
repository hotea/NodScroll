# NodScroll

<div align="center">

**Control webpage scrolling with head gestures | 用头部手势控制网页滚动**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-blue?logo=microsoft-edge)](https://microsoftedge.microsoft.com/addons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文](#中文)

</div>

---

## English

### 🎯 What is NodScroll?

NodScroll is a browser extension that detects your head movements to control webpage scrolling - completely hands-free! **Perfect for maintaining cervical spine health during long screen time.**

### 💪 Health Benefits

**Reduce Neck Strain While Working**
- Long hours staring at screens can cause neck stiffness and pain
- NodScroll encourages natural neck movement while browsing
- Gentle head gestures promote blood circulation in the cervical spine
- Combine productivity with neck exercises - stay healthy while you work!

### ✨ Features

| Gesture | Action |
|---------|--------|
| 👇 **Nod down** | Scroll down |
| 👆 **Nod up** | Scroll up |
| 👈 **Turn left** | Go back (browser history) |
| 👉 **Turn right** | Go forward (browser history) |

- ✅ **Hands-free browsing** - Perfect for eating, cooking, or multitasking
- ✅ **Background operation** - Works even when popup is closed
- ✅ **Privacy-first** - All processing happens locally, no data uploaded
- ✅ **Fully customizable** - Adjust sensitivity, scroll amount, and cooldown
- ✅ **Bilingual interface** - English and Chinese support
- ✅ **Powered by AI** - Uses MediaPipe Face Mesh for accurate tracking

### 🎬 Use Cases

- 📚 **Reading long articles** while eating or drinking
- 👨‍🍳 **Following recipes** while cooking
- 💼 **Long work sessions** - Exercise your neck while browsing
- 🏥 **Accessibility** - Aid for limited hand mobility
- 🧘 **Posture awareness** - Encourages active neck movement

### 📦 Installation

#### From Chrome Web Store / Edge Add-ons
Coming soon! The extension is currently under review.

#### From Source (Developer Mode)

```bash
# Clone the repository
git clone https://github.com/hotea/NodScroll.git
cd NodScroll

# Load in Chrome/Edge
1. Open chrome://extensions (or edge://extensions)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the NodScroll folder
```

### 🚀 Quick Start

#### First Time Setup
1. Click the NodScroll extension icon
2. Click "**Start**" - A permission page will open
3. Click "**Grant Camera Access**" and allow camera permission
4. Return to any webpage and start using!

#### Regular Use
1. Click the extension icon
2. Click "**Start**" to begin tracking
3. Wait ~1 second for calibration (status turns green)
4. **Close the popup** - tracking continues in background!
5. Perform head gestures to control the page
6. Click "**Stop**" when done

### ⚙️ Settings

Customize the extension to your preferences:

| Setting | Description | Default |
|---------|-------------|---------|
| **Pitch Threshold** | Sensitivity for up/down nod detection | 15° |
| **Yaw Threshold** | Sensitivity for left/right turn detection | 20° |
| **Scroll Amount** | Pixels to scroll per gesture | 300px |
| **Cooldown Time** | Minimum time between gestures | 800ms |
| **Scroll Direction** | Natural (Mac) or Classic (Windows) | Natural |
| **Language** | Interface language | Auto-detect |

### 🔒 Privacy & Security

- ✅ **No data collection** - We don't collect, store, or transmit any data
- ✅ **Local processing** - All face detection runs in your browser
- ✅ **No video upload** - Camera feed never leaves your device
- ✅ **Explicit consent** - Camera only active when you enable tracking
- ✅ **Open source** - Review the code yourself

### 🛠️ Technical Details

- **Architecture**: Manifest V3
- **Face Detection**: [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh) (468 landmarks)
- **Pose Estimation**: Calculates pitch (up/down) and yaw (left/right) from facial landmarks
- **State Machine**: IDLE → DETECTING → TRIGGERED → COOLDOWN
- **Smoothing**: Moving average filter to prevent jitter
- **Debouncing**: Cooldown mechanism to prevent accidental triggers

### 📋 Requirements

- Chrome 88+ or Edge 88+ (Manifest V3 support)
- Webcam
- Good lighting for optimal face detection

### 🐛 Troubleshooting

**Camera not working?**
- Ensure you've granted camera permissions to the extension
- Check if other apps are using the camera
- Try restarting the browser

**Gestures not detected?**
- Ensure good lighting on your face
- Click "Calibrate" to reset baseline position
- Adjust threshold settings (lower = more sensitive)

**Too many accidental triggers?**
- Increase threshold values (higher = less sensitive)
- Increase cooldown time
- Ensure stable seating position during calibration

**Extension icon not showing?**
- Pin the extension: Click the puzzle icon in toolbar → Pin NodScroll

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

MIT License - see [LICENSE](LICENSE) for details

### 📞 Contact

- **Author**: hotea
- **Email**: oksukai@gmail.com
- **GitHub**: https://github.com/hotea/NodScroll
- **Issues**: https://github.com/hotea/NodScroll/issues

---

## 中文

### 🎯 什么是 NodScroll？

NodScroll 是一款浏览器扩展，通过检测你的头部动作来控制网页滚动 - 完全无需动手！**非常适合在长时间看屏幕时活动颈椎，有利于颈椎健康。**

### 💪 健康益处

**边工作边保护颈椎**
- 长时间盯着屏幕容易导致颈部僵硬和疼痛
- NodScroll 鼓励在浏览时自然地活动颈部
- 轻柔的头部运动促进颈椎血液循环
- 将生产力与颈部锻炼相结合 - 工作的同时保持健康！

### ✨ 功能特点

| 手势 | 动作 |
|------|------|
| 👇 **低头** | 向下滚动 |
| 👆 **抬头** | 向上滚动 |
| 👈 **左转头** | 后退（浏览器历史） |
| 👉 **右转头** | 前进（浏览器历史） |

- ✅ **免手操作** - 非常适合吃饭、做饭或多任务处理
- ✅ **后台运行** - 即使关闭弹窗也能继续工作
- ✅ **隐私优先** - 所有处理在本地完成，不上传任何数据
- ✅ **完全可定制** - 调整灵敏度、滚动距离和冷却时间
- ✅ **双语界面** - 支持中英文
- ✅ **AI 驱动** - 使用 MediaPipe Face Mesh 进行精确追踪

### 🎬 使用场景

- 📚 **阅读长文章** 时吃东西或喝水
- 👨‍🍳 **查看菜谱** 时做饭
- 💼 **长时间工作** - 边浏览边活动颈椎
- 🏥 **辅助功能** - 帮助手部活动受限的用户
- 🧘 **姿势意识** - 鼓励主动活动颈部

### 📦 安装

#### 从 Chrome 网上应用店 / Edge 扩展商店
即将推出！扩展目前正在审核中。

#### 从源码安装（开发者模式）

```bash
# 克隆仓库
git clone https://github.com/hotea/NodScroll.git
cd NodScroll

# 在 Chrome/Edge 中加载
1. 打开 chrome://extensions（或 edge://extensions）
2. 启用"开发者模式"（右上角切换按钮）
3. 点击"加载已解压的扩展程序"
4. 选择 NodScroll 文件夹
```

### 🚀 快速开始

#### 首次设置
1. 点击 NodScroll 扩展图标
2. 点击"**开始**" - 将打开权限页面
3. 点击"**请求访问**"并允许摄像头权限
4. 返回任意网页即可开始使用！

#### 日常使用
1. 点击扩展图标
2. 点击"**开始**"启动追踪
3. 等待约 1 秒进行校准（状态变为绿色）
4. **关闭弹窗** - 追踪在后台继续运行！
5. 通过头部手势控制页面
6. 完成后点击"**停止**"

### ⚙️ 设置选项

根据个人喜好自定义扩展：

| 设置 | 说明 | 默认值 |
|------|------|--------|
| **俯仰阈值** | 上下点头的检测灵敏度 | 15° |
| **偏航阈值** | 左右转头的检测灵敏度 | 20° |
| **滚动距离** | 每次手势滚动的像素数 | 300px |
| **冷却时间** | 手势之间的最小间隔时间 | 800ms |
| **滚动方向** | 自然（Mac）或经典（Windows） | 自然 |
| **语言** | 界面语言 | 自动检测 |

### 🔒 隐私与安全

- ✅ **零数据收集** - 我们不收集、存储或传输任何数据
- ✅ **本地处理** - 所有面部检测在浏览器中运行
- ✅ **不上传视频** - 摄像头画面永远不会离开你的设备
- ✅ **明确同意** - 仅在你启用追踪时使用摄像头
- ✅ **开源代码** - 可自行审查代码

### 🛠️ 技术细节

- **架构**: Manifest V3
- **面部检测**: [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh)（468 个关键点）
- **姿态估计**: 从面部关键点计算俯仰（上下）和偏航（左右）角度
- **状态机**: 空闲 → 检测中 → 已触发 → 冷却中
- **平滑算法**: 移动平均滤波器防止抖动
- **防抖机制**: 冷却机制防止意外触发

### 📋 系统要求

- Chrome 88+ 或 Edge 88+（支持 Manifest V3）
- 网络摄像头
- 良好的光线以获得最佳面部检测效果

### 🐛 故障排除

**摄像头无法工作？**
- 确保已授予扩展摄像头权限
- 检查其他应用是否正在使用摄像头
- 尝试重启浏览器

**手势无法检测？**
- 确保面部光线充足
- 点击"校准"重置基准位置
- 调整阈值设置（降低 = 更灵敏）

**经常误触发？**
- 增加阈值（提高 = 不太灵敏）
- 增加冷却时间
- 校准时确保坐姿稳定

**扩展图标不显示？**
- 固定扩展：点击工具栏中的拼图图标 → 固定 NodScroll

### 🤝 参与贡献

欢迎贡献！请随时提交 Pull Request。

### 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

### 📞 联系方式

- **作者**: hotea
- **邮箱**: oksukai@gmail.com
- **GitHub**: https://github.com/hotea/NodScroll
- **问题反馈**: https://github.com/hotea/NodScroll/issues

---

<div align="center">

**Made with ❤️ for healthier browsing**

**为更健康的浏览而制作**

</div>
