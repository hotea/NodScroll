# ✅ Edge Add-ons 提交准备完成

## 📋 提交清单

### ✅ 所有材料已准备就绪

- [x] **扩展包**: `nod-scroll-v1.0.0.zip` (7.0 MB, 34 files)
- [x] **截图**: `screenshots/resized/` (2 张，1280x800)
  - 01-auth.png (323 KB) - 权限设置页面
  - 02-initialize.png (311 KB) - 初始化界面
- [x] **商店信息**: `STORE_LISTING.md` 和 `EDGE_SUBMISSION.md`
- [x] **隐私政策**: ✅ 已上线！
  - URL: https://hotea.github.io/NodScroll/PRIVACY_POLICY.html
  - 状态: HTTP 200 (可访问)
- [x] **README**: 完整的中英文文档
- [x] **代码仓库**: https://github.com/hotea/NodScroll

---

## 🎯 核心定位：颈椎健康

### 主要卖点
> **边浏览边活动颈椎！长时间看屏幕的健康伴侣。**

### 健康益处
- 长时间盯屏幕容易导致颈部僵硬和疼痛
- NodScroll 鼓励在浏览时自然地活动颈部
- 促进颈椎血液循环
- 将生产力与颈部锻炼相结合

### 目标用户
- 💼 长时间办公的上班族
- 👨‍💻 程序员、设计师等久坐人群
- 📚 长时间阅读的学生和研究人员
- 🏥 关注颈椎健康的人群

---

## 🚀 提交步骤（15 分钟完成）

### Step 1: 访问 Edge 开发者中心
**URL**: https://partner.microsoft.com/dashboard/microsoftedge/public/login

**操作**:
- 使用 Microsoft 账号登录
- 如果没有账号，免费注册一个

---

### Step 2: 提交新扩展
**操作**:
1. 点击 **"Add new extension"** 或 **"提交新扩展"**
2. 上传文件: `nod-scroll-v1.0.0.zip`
3. 等待自动验证（几秒钟）

---

### Step 3: 填写基本信息

#### Display Name（显示名称）
```
NodScroll - Head Gesture Control
```

#### Short Description（简短描述）
```
Exercise your neck while browsing! Control scrolling with head gestures. Perfect for cervical spine health during screen time.
```

#### Category（类别）
```
Productivity（生产力）
```
- 也可考虑: Health & Fitness（如果有该选项）

#### Languages（语言）
- [x] English
- [x] Chinese (Simplified) - 中文（简体）

---

### Step 4: 填写详细描述

**复制粘贴以下内容到 "Description" 字段**:

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

---

### Step 5: 隐私设置

#### Privacy Policy（隐私政策）⭐ 重要
- 选择: **Use privacy policy URL**
- URL:
```
https://hotea.github.io/NodScroll/PRIVACY_POLICY.html
```
✅ 已验证可访问 (HTTP 200)

#### Data Collection（数据收集）
- Does your extension collect user data?: **No**

---

### Step 6: 上传截图

**上传以下 2 张图片**:

1. **Screenshot 1**: `screenshots/resized/01-auth.png`
   - Title: "Camera Permission Setup"
   - Description: "Easy first-time setup with clear instructions"

2. **Screenshot 2**: `screenshots/resized/02-initialize.png`
   - Title: "Extension Interface"
   - Description: "Clean and intuitive control panel"

**提示**: 可以再添加 1-3 张截图展示核心功能（可选但推荐）

---

### Step 7: 权限说明

**在 "Justification" 字段中粘贴**:

```
PERMISSIONS JUSTIFICATION:

• activeTab: Required to send scroll commands to the current active tab
• scripting: Required to inject content script for executing page scrolling
• storage: Required to save user preference settings (sensitivity, language, etc.)
• offscreen: Required to run MediaPipe face detection in background without keeping popup open
• host_permissions (<all_urls>): Required to enable scrolling control on any webpage user visits

CAMERA ACCESS:
Camera is only accessed when user explicitly clicks "Start" to enable tracking. All video processing happens locally using MediaPipe Face Mesh. No images or video are uploaded or stored. This promotes cervical spine health by encouraging natural neck movement during extended screen time.
```

---

### Step 8: 支持信息

#### Support Website（支持网站）
```
https://github.com/hotea/NodScroll
```

#### Support Email（支持邮箱）
```
oksukai@gmail.com
```

---

### Step 9: 提交审核

**最后检查**:
- [ ] 所有必填字段已填写
- [ ] 隐私政策 URL 正确 (https://hotea.github.io/NodScroll/PRIVACY_POLICY.html)
- [ ] 截图已上传（至少 2 张）
- [ ] 权限说明清晰完整
- [ ] 支持信息正确

**提交**:
1. 勾选同意条款
2. 点击 **"Submit for review"** 或 **"提交审核"**

---

## ⏱️ 时间线预期

| 阶段 | 预计时间 |
|------|---------|
| 填写提交表单 | 10-15 分钟 |
| 自动验证 | 1-2 分钟 |
| 人工审核 | 1-2 个工作日 |
| 发布上架 | 审核通过后立即生效 |
| **总计** | **~1-2 天** |

---

## 📊 审核通过后

### 你的扩展链接
```
https://microsoftedge.microsoft.com/addons/detail/nodscroll/[ID]
```

### 开发者控制台
```
https://partner.microsoft.com/dashboard/microsoftedge/overview
```

**可查看**:
- 安装数量
- 用户评分和评论
- 使用趋势
- 地理分布

---

## 🎉 接下来

### 审核通过后的推广建议

**社交媒体**:
- 小红书: 发布"久坐办公保护颈椎神器"
- 知乎: 写文章"程序员必备：边工作边保护颈椎"
- Twitter/X: 发布演示视频
- Reddit: r/productivity, r/health

**内容营销**:
- 撰写博客: "如何在长时间看屏幕时保护颈椎"
- 制作视频: 演示如何使用 + 健康益处
- Product Hunt: 提交产品（突出健康卖点）

**SEO 关键词**:
- 颈椎健康
- 久坐办公
- 程序员健康
- head gesture control
- cervical spine health
- ergonomic browsing

---

## 💡 提示

1. **突出健康益处**: 在所有宣传中强调"保护颈椎"这一核心卖点
2. **目标用户**: 重点推广给长时间用电脑的人群（程序员、设计师、作家等）
3. **使用场景**: 不仅仅是便利工具，更是健康工具

---

## 📞 需要帮助？

**如果遇到问题**:
1. 查看详细指南: `EDGE_SUBMISSION.md`
2. 参考商店信息: `STORE_LISTING.md`
3. Edge 帮助文档: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension
4. 联系作者: oksukai@gmail.com

---

## ✅ 准备就绪！

所有材料已准备完毕，现在可以开始提交到 Edge Add-ons！

**开始提交**: https://partner.microsoft.com/dashboard/microsoftedge/public/login

祝提交顺利！🚀
