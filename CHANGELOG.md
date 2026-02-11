# NodScroll 更新日志 / Changelog

## [1.1.5] - 2025-02-07

### 🐛 修复关键点闪烁 / Fixed Keypoint Flickering

#### 修复 / Fixed
- 🔧 **消除关键点闪烁**: 保存上一帧的 landmarks 数据，当检测失败时使用缓存
- ✨ **更稳定的显示**: 即使某帧未检测到人脸，关键点也能保持显示

#### 技术细节 / Technical Details
```javascript
// 问题根源
sendPreviewFrame(null)        // 无人脸 → 关键点消失
sendPreviewFrame(landmarks)   // 检测到 → 关键点显示
// 结果：快速切换导致闪烁

// 解决方案
let lastLandmarks = null;
const displayLandmarks = landmarks || lastLandmarks;
// 结果：始终显示最后一次成功检测的关键点
```

#### 原理 / Explanation
- 人脸检测偶尔会失败（光线、角度、遮挡）
- 原代码在检测失败时不绘制关键点
- 新代码缓存最后一次成功的 landmarks
- 检测失败时使用缓存数据，保持连续显示

---

## [1.1.4] - 2025-02-07

### 🎨 增强轨迹和关键点可见性 / Enhanced Trail and Keypoint Visibility

#### 改进 / Improved
- ✨ **更粗的轨迹线**: 线宽从 2-4px 增加到 4-10px（提升 150%）
- 🎯 **更大的关键点**: 圆点从 3px/5px 增加到 5px/12px
- 💫 **三层光晕效果**: 关键点使用三层渐变光晕（12px/8px/5px）
- 🌟 **更亮的追踪点**: 鼻尖追踪点三层光晕（15px/10px/6px）
- 📏 **更长的轨迹**: 轨迹点数从 40 增加到 60（提升 50%）
- 💡 **更强的发光**: 关键点和追踪点增加阴影模糊效果

#### 技术细节 / Technical Details
```javascript
// 轨迹线宽
线宽: 4px → 10px (渐变)
透明度: 0.4 → 1.0
色相: 180° → 260°

// 关键点
外圈: 12px (30% alpha)
中圈: 8px (60% alpha)
内圈: 5px (100% alpha) + 8px shadow

// 追踪点
外圈: 15px (20% alpha)
中圈: 10px (40% alpha)
内圈: 6px (100% alpha) + 15px shadow
```

---

## [1.1.3] - 2025-02-07

### 🎨 视觉反馈优化 / Visual Feedback Improvements

#### 改进 / Improved
- ✨ **连续轨迹线**: 鼻尖运动轨迹改为连续渐变线条，从旧到新颜色和粗细逐渐变化
- 🎨 **彩色关键点**: 面部关键点使用彩色编码系统
  - 🔴 鼻尖 (Nose) - 红色
  - 🔵 下巴 (Chin) - 青色
  - 💚 眼睛外角 - 浅青色
  - 💗 嘴角 - 粉红色
- ✨ **光晕效果**: 关键点和鼻尖追踪点增加外圈光晕，提升可见性
- 📏 **更平滑轮廓**: 面部轮廓线使用更亮的蓝色和圆角连接

#### 添加 / Added
- 📝 创建 CHANGELOG.md 记录版本变更历史
- 🚀 创建 release.sh 自动化发布脚本
  - 自动更新版本号
  - 自动创建 git tag
  - 自动推送到远程仓库

#### 技术细节 / Technical Details
```javascript
// 轨迹渐变效果
- 透明度: 0.3 → 1.0
- 色相: 180° (cyan) → 260° (green)
- 线宽: 2px → 4px

// 关键点双层绘制
- 外圈光晕: 5px 半透明
- 内圈实心: 3px 纯色
```

---

## [1.1.2] - 2025-02-07

### 🐛 修复 / Fixed
- 🔧 恢复头部轨迹和面部特征点显示（v1.1.1 默认启用高质量模式导致不显示）

### 变更 / Changed
- ⚙️ 将 `highQualityMode` 默认值改为 `false`

---

## [1.1.1] - 2025-02-07

### 📹 视频质量最大化 / Maximum Video Quality

#### 添加 / Added
- 🎯 高质量模式选项（减少叠加层，优先视频清晰度）

#### 改进 / Improved
- 🎥 **更高分辨率请求**: 1280x720 → 1920x1080 (Full HD)
- 📦 **更好的编码格式**: JPEG 0.92 → WebP 0.98 → PNG 无损降级链
- 📏 **最小分辨率要求**: 1280x720
- 🎨 减少 canvas 叠加层绘制（高质量模式下）

#### 技术细节 / Technical Details
```javascript
// 视频约束
{
  width: { ideal: 1920, min: 1280 },
  height: { ideal: 1080, min: 720 },
  frameRate: { ideal: 30, min: 24 }
}

// 编码格式降级链
WebP (0.98) → PNG (lossless) → JPEG (fallback)
```

---

## [1.1.0] - 2025-02-07

### 🎯 清晰度优化 / Clarity Optimization

#### 变更 / Changed
- 🖼️ **实际分辨率映射**: previewCanvas 使用视频流实际分辨率
- 🚫 **全面禁用图像平滑**: Canvas 和 CSS 双重禁用
- 📐 **显示方式优化**: object-fit cover → contain

#### 添加 / Added
- 🎨 CSS `image-rendering: crisp-edges` 优化
- 📊 实际分辨率日志输出

#### 修复 / Fixed
- 🔧 build.sh 自动从 manifest.json 读取版本号

#### 技术细节 / Technical Details
```css
#overlay {
  image-rendering: crisp-edges;
  object-fit: contain;
}
```

```javascript
ctx.imageSmoothingEnabled = false;
previewCtx.imageSmoothingEnabled = false;
```

---

## [1.0.0] - 2026-02-07

### 🌍 国际化支持 / Internationalization

#### 添加 / Added
- ✅ 标准 Chrome 扩展国际化支持
- ✅ `_locales/en/messages.json` - 英文本地化
- ✅ `_locales/zh_CN/messages.json` - 简体中文本地化
- ✅ `build.sh` - 自动化打包脚本

#### 修改 / Changed
- 📝 `manifest.json` - 使用 `__MSG_extensionName__` 格式
- 📝 `manifest.json` - 添加 `default_locale: "en"`
- 📦 扩展包从 37 个文件增加到 42 个文件

#### 修复 / Fixed
- 🐛 修复 Edge Add-ons 商店无法识别中文语言的问题
- 🐛 现在商店可以正确显示语言下拉菜单（English + 简体中文）

---

### 📦 扩展包对比

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 文件数 | 37 | 42 |
| 大小 | 7.0 MB | 7.0 MB |
| 支持语言 | 仅英文 | 英文 + 简体中文 ✅ |
| 商店语言配置 | 不可用 | 可用 ✅ |

---

### 🔧 技术细节

#### 文件结构变化

```diff
nod-scroll/
├── manifest.json          (修改)
├── build.sh               (新增)
+ ├── _locales/            (新增)
+ │   ├── en/
+ │   │   └── messages.json
+ │   └── zh_CN/
+ │       └── messages.json
├── auth/
├── background/
├── content/
├── offscreen/
├── popup/
├── sandbox/
├── lib/
└── icons/
```

#### manifest.json 变化

```diff
{
  "manifest_version": 3,
- "name": "NodScroll",
+ "name": "__MSG_extensionName__",
  "version": "1.0.0",
- "description": "Control webpage scrolling with head gestures using your camera",
+ "description": "__MSG_extensionDescription__",
+ "default_locale": "en",
  ...
}
```

---

### 📚 相关文档

- **国际化说明**: `docs/I18N_LOCALIZATION.md`
- **发布指南**: `docs/PUBLISHING.md`
- **Edge 提交指南**: `docs/EDGE_SUBMISSION.md`

---

### 🚀 如何更新

如果你已经开始提交到 Edge Add-ons：

1. **下载新的扩展包**：
   ```bash
   # 包含国际化支持的版本
   nod-scroll-v1.0.0.zip
   ```

2. **重新上传到商店**：
   - 删除或覆盖旧的上传
   - 上传新的 `nod-scroll-v1.0.0.zip`

3. **配置语言**：
   - 在 Store Listing 步骤
   - 选择 "English (United States)"
   - 填写英文商店信息
   - 点击添加语言
   - 选择 "中文（简体）"
   - 填写中文商店信息

4. **提交审核**

---

### ⚠️ 破坏性变更 / Breaking Changes

**无** - 此更新完全向后兼容，不影响现有用户。

---

### 🐛 已知问题 / Known Issues

**无** - 当前版本运行稳定。

---

### 📞 支持 / Support

如有问题，请：
- 查看文档：`docs/I18N_LOCALIZATION.md`
- 提交 Issue：https://github.com/hotea/NodScroll/issues
- 联系邮箱：oksukai@gmail.com

---

## 历史版本 / Previous Versions

### [1.0.0-initial] - 2026-02-06

#### 初始发布 / Initial Release
- 🎉 首次发布
- 📦 基于摄像头的头部手势检测
- 🎯 支持点头/转头控制滚动
- 🌐 中英文界面（运行时切换）
- 🔒 隐私优先的本地处理
- 💪 突出颈椎健康益处

---

**完整更新历史请查看 Git 提交记录**：
```bash
git log --oneline --graph --all
```
