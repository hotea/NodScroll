# Chrome Web Store 提交指南 / Chrome Web Store Submission Guide

## ✅ 准备清单 / Preparation Checklist

您的扩展已经完全兼容 Chrome Web Store！以下是提交所需的所有材料：

### 1. 扩展包 / Extension Package
- ✅ **文件**: `nod-scroll-v1.1.5.zip` (7.0MB)
- ✅ **Manifest V3**: 完全兼容
- ✅ **权限**: 符合 Chrome Web Store 政策
- ✅ **国际化**: 支持英文和简体中文

### 2. 隐私政策 / Privacy Policy
- ✅ **文件**: `PRIVACY_POLICY.md`
- ⚠️ **需要**: 托管到公开 URL

**选项 A - 使用 GitHub Pages（推荐）**:
```bash
# 1. 在 GitHub 仓库设置中启用 Pages
# 2. 隐私政策 URL 将是:
https://hotea.github.io/NodScroll/PRIVACY_POLICY.html

# 或使用 raw GitHub URL:
https://raw.githubusercontent.com/hotea/NodScroll/main/PRIVACY_POLICY.md
```

**选项 B - 使用 GitHub Gist**:
1. 访问 https://gist.github.com
2. 创建新 Gist，粘贴隐私政策内容
3. 获取公开链接

**选项 C - 自己的网站**:
- 如果您有个人网站，上传隐私政策到您的域名

### 3. 商店素材 / Store Assets

#### 图标 / Icons
- ✅ `icons/icon128.png` (128x128) - 已准备

#### 促销图 / Promotional Images
- ✅ `promo_tiles/small_promo_tile_440x280.png` (440x280) - 小型促销磁贴
- ✅ `promo_tiles/large_promo_tile_1400x560.png` (1400x560) - 大型促销磁贴
- ✅ `promo_tiles/small_promo_tile_440x280_cn.png` - 中文版小型磁贴
- ✅ `promo_tiles/large_promo_tile_1400x560_cn.png` - 中文版大型磁贴

#### 截图 / Screenshots (需要 1-5 张)
- ⚠️ **要求**: 1280x800 或 640x400 像素
- ⚠️ **当前**: `screenshots/resized/` 目录有 2 张
- 💡 **建议**: 准备 3-5 张展示主要功能的截图

**推荐截图内容**:
1. 扩展启动界面（摄像头预览 + 设置）
2. 实时追踪效果（显示人脸关键点和轨迹）
3. 设置面板（展示可自定义选项）
4. 实际使用场景（在网页上滚动）
5. 校准过程或帮助说明

---

## 🚀 提交步骤 / Submission Steps

### 第一步：创建开发者账号 / Step 1: Create Developer Account

1. 访问 **Chrome Web Store Developer Dashboard**:
   https://chrome.google.com/webstore/devconsole

2. 使用 Google 账号登录

3. 支付 **$5 一次性注册费用**
   - 使用信用卡或借记卡
   - 这是一次性费用，之后发布扩展永久免费

4. 填写开发者信息
   - 开发者名称: `hotea`
   - 邮箱: `oksukai@gmail.com`
   - 网站（可选）: `https://github.com/hotea/NodScroll`

---

### 第二步：上传扩展包 / Step 2: Upload Extension

1. 在 Developer Dashboard，点击 **"New Item"**

2. 上传 `nod-scroll-v1.1.5.zip`
   - 系统会自动验证 manifest.json
   - 确保没有警告或错误

3. 等待上传完成

---

### 第三步：填写商店信息 / Step 3: Fill Store Listing

#### A. 基本信息 / Basic Info

**Product Details**:
```
Name: NodScroll - Head Gesture Control
Summary (132 chars max):
Exercise your neck while browsing! Control scrolling with head gestures. Perfect for cervical spine health during screen time.
```

**Description**:
```
(使用 docs/STORE_LISTING.md 中的 English 完整描述)
```

**Category**:
- Primary: **Productivity**
- Secondary: **Accessibility** (可选)

**Language**:
- Default: **English (United States)**

---

#### B. 图形资源 / Graphic Assets

**Store Icon** (必需):
- 上传: `icons/icon128.png`

**Screenshots** (至少 1 张，最多 5 张):
- 上传 `screenshots/resized/` 中的截图
- 或从 `screenshots/` 准备新的高质量截图
- **推荐**: 1280x800 像素

**Promotional Tiles** (可选但推荐):
- Small: `promo_tiles/small_promo_tile_440x280.png`
- Large: `promo_tiles/large_promo_tile_1400x560.png`

**Marquee Promotional Tile** (可选):
- 如果有，可以提供 1400x560 的横幅图

---

#### C. 隐私与合规 / Privacy & Compliance

**Privacy Policy**:
- URL: `https://raw.githubusercontent.com/hotea/NodScroll/main/PRIVACY_POLICY.md`
  - 或您托管隐私政策的 URL

**Permissions Justification**:

填写每个权限的说明（从 docs/STORE_LISTING.md 复制）:

| 权限 | 说明 |
|------|------|
| `activeTab` | Send scroll commands to the current webpage |
| `tabs` | Detect when user switches tabs to pause tracking |
| `scripting` | Inject content script to execute page scrolling |
| `storage` | Save user preferences (sensitivity, scroll settings) |
| `offscreen` | Run MediaPipe face detection in background for better performance |
| `host_permissions: <all_urls>` | Enable scroll control on any webpage you visit |

**Camera Permission**:
```
NodScroll uses your camera to detect head gestures for hands-free scrolling.
- Camera is only active when you click "Start"
- All processing happens locally in your browser
- No images or video are saved, uploaded, or transmitted
- You can disable camera access at any time
```

**Single Purpose**:
```
NodScroll serves a single purpose: Enable hands-free webpage scrolling through head gesture detection, promoting neck exercise during screen time.
```

---

#### D. 支持与分发 / Support & Distribution

**Website**: `https://github.com/hotea/NodScroll`

**Support Email**: `oksukai@gmail.com`

**Support URL**: `https://github.com/hotea/NodScroll/issues`

**Distribution**:
- ✅ **Public** - 向所有用户公开
- Region: **All regions** / 所有地区

---

### 第四步：添加中文语言支持 / Step 4: Add Chinese Language

1. 在 Store Listing 页面，点击 **"Add Language"**

2. 选择 **"中文（简体）"** / **"Chinese (Simplified)"**

3. 填写中文商店信息（从 `docs/STORE_LISTING.md` 复制）:
   - 名称: `NodScroll - 头部手势控制`
   - 简短描述: `边浏览边活动颈椎！通过头部手势控制滚动。长时间看屏幕的健康伴侣。`
   - 详细描述: (使用完整的中文描述)

4. 上传中文版促销图:
   - Small: `promo_tiles/small_promo_tile_440x280_cn.png`
   - Large: `promo_tiles/large_promo_tile_1400x560_cn.png`

---

### 第五步：预览和提交 / Step 5: Preview & Submit

1. 点击 **"Preview"** 查看商店页面预览

2. 检查所有信息是否正确:
   - ✅ 扩展名称和描述
   - ✅ 图标和截图清晰
   - ✅ 隐私政策链接有效
   - ✅ 权限说明完整
   - ✅ 中英文版本都已填写

3. 点击 **"Submit for Review"** 提交审核

4. 等待审核（通常 **1-3 个工作日**）

---

## 📋 审核注意事项 / Review Notes

### 常见审核问题 / Common Review Issues

1. **隐私政策无法访问**
   - 确保隐私政策 URL 公开可访问
   - 不要使用需要登录的链接

2. **权限说明不清**
   - 详细解释每个权限的用途
   - 特别是 `<all_urls>` 和摄像头权限

3. **截图质量低**
   - 使用高分辨率截图（1280x800）
   - 展示扩展实际功能
   - 避免模糊或失真

4. **单一用途不明确**
   - 清楚说明扩展的单一目的
   - 避免功能过于复杂或分散

### 如何加速审核 / Speed Up Review

1. **详细的权限说明**: 为每个权限提供清晰的理由
2. **高质量截图**: 展示扩展主要功能
3. **清晰的隐私政策**: 说明数据如何处理
4. **测试账号**: 如果需要，提供测试账号（NodScroll 不需要）

---

## 🎯 审核后 / After Approval

### 发布确认 / Publication Confirmation

审核通过后，您会收到邮件通知。扩展将在 **Chrome Web Store** 上线：

```
https://chrome.google.com/webstore/detail/[extension-id]
```

### 推广建议 / Promotion Tips

1. **在 README 中添加徽章**:
   ```markdown
   [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/[extension-id].svg)](https://chrome.google.com/webstore/detail/[extension-id])
   [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/[extension-id].svg)](https://chrome.google.com/webstore/detail/[extension-id])
   ```

2. **社交媒体分享**:
   - Product Hunt
   - Reddit (r/Chrome, r/productivity)
   - Twitter/X
   - Hacker News

3. **制作演示视频**:
   - 上传到 YouTube
   - 展示实际使用场景
   - 强调健康益处

4. **博客文章**:
   - 撰写使用教程
   - 分享开发经验
   - SEO 优化

---

## 🔄 更新扩展 / Update Extension

当发布新版本时（例如 v1.1.6）:

1. 更新 `manifest.json` 中的版本号
2. 运行 `./release.sh` 打包新版本
3. 在 Developer Dashboard 中上传新 ZIP
4. 更新 "What's New" 部分说明更新内容
5. 提交审核（更新通常审核更快，~1 天）

---

## 📊 分析和反馈 / Analytics & Feedback

### Chrome Web Store 提供的数据:

- 安装数
- 评分和评论
- 周活跃用户数
- 卸载率

### 处理用户反馈:

1. **积极回复评论**: 感谢好评，解决差评问题
2. **修复 Bug**: 根据反馈快速更新
3. **功能请求**: 考虑用户建议
4. **文档改进**: 更新使用说明

---

## ❓ 常见问题 / FAQ

**Q: 需要多少费用？**
A: $5 一次性开发者注册费，之后发布和更新永久免费。

**Q: 审核需要多久？**
A: 首次审核通常 1-3 个工作日，更新审核通常 1 天。

**Q: Edge 已上架，Chrome 会自动同步吗？**
A: 不会，Chrome Web Store 需要单独提交。但扩展包通用（同一个 ZIP）。

**Q: 是否需要修改代码？**
A: 不需要！您的扩展已完全兼容 Chrome Web Store。

**Q: 隐私政策必须有独立网页吗？**
A: 是的，Chrome Web Store 要求提供公开可访问的隐私政策 URL。

**Q: 截图必须是 1280x800 吗？**
A: 推荐 1280x800 或 640x400，但其他常见宽高比也可接受。

**Q: 可以同时上架多个商店吗？**
A: 可以！同一个扩展可以在 Chrome、Edge、Firefox 等多个商店上架。

---

## 📞 需要帮助？ / Need Help?

如果遇到问题：

1. **Chrome Web Store 帮助中心**: https://developer.chrome.com/docs/webstore/
2. **开发者论坛**: https://groups.google.com/a/chromium.org/g/chromium-extensions
3. **我的邮箱**: oksukai@gmail.com

---

## ✅ 快速检查清单 / Quick Checklist

提交前确认：

- [ ] 开发者账号已创建并支付 $5
- [ ] 扩展包 `nod-scroll-v1.1.5.zip` 准备就绪
- [ ] 隐私政策已托管到公开 URL
- [ ] 至少准备 1 张截图（推荐 3-5 张）
- [ ] 促销图片已准备（440x280 和 1400x560）
- [ ] 商店列表信息（英文 + 中文）已准备
- [ ] 权限说明已填写
- [ ] 支持邮箱和网站已填写
- [ ] 预览页面查看无误
- [ ] 点击提交审核

---

**祝您发布顺利！🎉**

如果审核遇到问题，可以随时联系我协助解决。
