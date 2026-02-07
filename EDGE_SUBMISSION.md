# Edge Add-ons 提交指南 / Edge Add-ons Submission Guide

## 📋 提交前准备清单

### ✅ 已准备好的材料
- [x] 扩展包：`nod-scroll-v1.0.0.zip` (7.0 MB)
- [x] 截图：`screenshots/resized/` (2 张，1280x800)
- [x] 商店信息：参考 `STORE_LISTING.md`
- [ ] 隐私政策 URL：需要先激活 GitHub Pages

### ⚠️ 立即需要：设置 GitHub Pages

1. **访问 GitHub Pages 设置页面**：
   https://github.com/hotea/NodScroll/settings/pages

2. **配置 Pages**：
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - 点击 **Save**

3. **等待部署**（约 2-5 分钟）

4. **验证隐私政策可访问**：
   https://hotea.github.io/NodScroll/PRIVACY_POLICY.html

---

## 🚀 提交步骤

### 步骤 1: 创建开发者账号

1. 访问：https://partner.microsoft.com/dashboard/microsoftedge/public/login
2. 使用 Microsoft 账号登录（如果没有，注册一个）
3. 完成开发者注册（免费，无需支付）

### 步骤 2: 提交新扩展

1. 登录后，点击 **"提交新扩展"** 或 **"Add new extension"**
2. 上传 `nod-scroll-v1.0.0.zip`
3. 等待自动验证（通常几秒钟）

### 步骤 3: 填写基本信息

#### Display Name（显示名称）
```
NodScroll - Head Gesture Control
```

#### Short Description（简短描述，132 字符以内）
```
Exercise your neck while browsing! Control scrolling with head gestures. Perfect for cervical spine health during screen time.
```

#### Category（类别）
```
Productivity（生产力）
```

#### Languages（语言）
- ✅ English
- ✅ Chinese (Simplified) - 中文（简体）

### 步骤 4: 填写详细描述

**在 "Description" 字段中，粘贴以下内容**：

```
NodScroll lets you control webpage scrolling using simple head gestures - no hands needed! Perfect for maintaining cervical spine health during long screen time.

💪 HEALTH BENEFITS
Long hours staring at screens can cause neck stiffness and pain. NodScroll encourages natural neck movement while browsing, promoting blood circulation in the cervical spine. Combine productivity with neck exercises - stay healthy while you work!

🎯 HOW IT WORKS
1. Click the extension icon and grant camera permission
2. Wait ~1 second for calibration
3. Use head gestures to control:
   • Nod down → Scroll down
   • Nod up → Scroll up
   • Turn left → Go back
   • Turn right → Go forward

✨ KEY FEATURES
• Hands-free browsing - Perfect for eating, cooking, or multitasking
• Works in background - No need to keep popup open
• Privacy-first - All processing happens locally, no data uploaded
• Customizable - Adjust sensitivity, scroll amount, and cooldown
• Bilingual - English and Chinese interface
• Powered by MediaPipe Face Mesh - Industry-leading AI face tracking

🔒 PRIVACY & SECURITY
• Camera only active when you enable tracking
• All face detection runs locally in your browser
• Zero data collection or upload
• Open source - Review the code yourself

💡 USE CASES
• Long work sessions - Exercise your neck while browsing
• Reading long articles while eating or drinking
• Following recipes while cooking
• Scrolling through social feeds hands-free
• Posture awareness - Encourages active neck movement
• Accessibility aid for limited hand mobility

⚙️ SETTINGS
• Pitch/Yaw thresholds - Control gesture sensitivity
• Scroll amount - How far to scroll per gesture
• Cooldown time - Prevent accidental triggers
• Scroll direction - Natural (Mac) or Classic (Windows)

🖥️ SYSTEM REQUIREMENTS
• Edge 88+ (Manifest V3 support)
• Webcam
• Good lighting for optimal face detection

Built with MediaPipe Face Mesh technology by Google.
```

### 步骤 5: 隐私设置

#### Privacy Policy（隐私政策）
- 选择：**Use privacy policy URL**
- URL:
```
https://hotea.github.io/NodScroll/PRIVACY_POLICY.html
```

#### Data Collection（数据收集）
- Does your extension collect user data?: **No**

### 步骤 6: 上传截图和图标

#### 图标
- Edge 会自动从扩展包中读取图标
- 无需手动上传

#### 截图（至少 1 张，最多 10 张）
上传以下文件：
1. `screenshots/resized/01-auth.png`
2. `screenshots/resized/02-initialize.png`

**截图标题建议**：
- Screenshot 1: "Camera Permission Setup"
- Screenshot 2: "Extension Interface"

### 步骤 7: 权限说明

Edge 会显示扩展请求的权限，需要在 "Justification" 字段中说明每个权限的用途：

```
PERMISSIONS JUSTIFICATION:

• activeTab: Required to send scroll commands to the current active tab
• scripting: Required to inject content script for executing page scrolling
• storage: Required to save user preference settings (sensitivity, language, etc.)
• offscreen: Required to run MediaPipe face detection in background without keeping popup open
• host_permissions (<all_urls>): Required to enable scrolling control on any webpage user visits

CAMERA ACCESS:
Camera is only accessed when user explicitly clicks "Start" to enable tracking. All video processing happens locally using MediaPipe Face Mesh. No images or video are uploaded or stored.
```

### 步骤 8: 支持信息

#### Support Website（支持网站）
```
https://github.com/hotea/NodScroll
```

#### Support Email（支持邮箱）
```
oksukai@gmail.com
```

### 步骤 9: 提交审核

1. 检查所有信息是否填写完整
2. 勾选同意条款
3. 点击 **"Submit for review"** 或 **"提交审核"**

---

## ⏱️ 审核时间线

| 阶段 | 预计时间 |
|------|---------|
| 自动验证 | 1-2 分钟 |
| 人工审核 | 1-2 个工作日 |
| 发布上架 | 审核通过后立即生效 |

---

## 📊 审核通过后

### 扩展链接
审核通过后，你的扩展将在以下链接可用：
```
https://microsoftedge.microsoft.com/addons/detail/nodscroll/[ID]
```

### 开发者控制台
可以在以下位置查看统计数据：
```
https://partner.microsoft.com/dashboard/microsoftedge/overview
```

包括：
- 安装数量
- 评分和评论
- 使用趋势

---

## ❓ 常见问题

### Q: 为什么需要 <all_urls> 权限？
**A**: 为了在任意网页上执行滚动控制。这是内容脚本的必需权限。

### Q: 审核可能被拒的原因？
**A**:
1. 隐私政策 URL 无法访问 → 确保 GitHub Pages 已激活
2. 权限说明不清晰 → 使用上述提供的说明
3. 截图不符规范 → 确保尺寸为 1280x800 或 640x400

### Q: 如何更新扩展？
**A**:
1. 修改 manifest.json 中的版本号
2. 打包新的 zip 文件
3. 在开发者控制台上传新版本

---

## 📞 需要帮助？

- **Edge Add-ons 帮助文档**: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension
- **开发者支持**: https://developer.microsoft.com/microsoft-edge/
- **联系作者**: oksukai@gmail.com

---

## ✅ 提交检查清单

提交前最后检查：

- [ ] GitHub Pages 已激活，隐私政策可访问
- [ ] 扩展包 zip 文件准备好
- [ ] 至少 2 张截图已上传
- [ ] 所有必填字段已填写
- [ ] 权限说明清晰完整
- [ ] 支持邮箱和网站链接正确
- [ ] 同意商店条款

**一切准备就绪！开始提交吧！** 🚀
