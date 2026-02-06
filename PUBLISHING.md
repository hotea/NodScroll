# 发布指南 / Publishing Guide

## 📦 已准备好的文件

✅ **nod-scroll-v1.0.0.zip** (7.0 MB, 34 files)
- 可直接上传到 Chrome Web Store 和 Edge Add-ons

✅ **STORE_LISTING.md**
- 包含完整的商店信息、描述、标签等

✅ **PRIVACY_POLICY.html**
- 隐私政策页面，可托管到 GitHub Pages

## 🚀 发布步骤

### Chrome Web Store

#### 1. 创建开发者账号
- 访问：https://chrome.google.com/webstore/devconsole
- 支付 $5 一次性注册费
- 完成账号验证

#### 2. 上传扩展
1. 点击"新增项"
2. 上传 `nod-scroll-v1.0.0.zip`
3. 填写商店信息（参考 STORE_LISTING.md）

#### 3. 必填信息
- **名称**: NodScroll - Head Gesture Control
- **简短描述**: 从 STORE_LISTING.md 复制
- **详细描述**: 从 STORE_LISTING.md 复制
- **类别**: 生产力工具
- **语言**: 英语、中文

#### 4. 隐私政策
1. 先设置 GitHub Pages（见下方）
2. 填写隐私政策 URL: `https://hotea.github.io/NodScroll/PRIVACY_POLICY.html`

#### 5. 图标和截图
- 图标已包含在扩展中（自动读取）
- 需要准备：
  - 至少 1 张截图 (1280x800 或 640x400)
  - 可选：宣传图 (440x280 或 1400x560)

#### 6. 提交审核
- 审核时间：通常 1-3 个工作日
- 会收到邮件通知审核结果

---

### Microsoft Edge Add-ons

#### 1. 创建开发者账号
- 访问：https://partner.microsoft.com/dashboard/microsoftedge
- 注册账号（免费）
- 完成身份验证

#### 2. 上传扩展
1. 点击"提交新扩展"
2. 上传 `nod-scroll-v1.0.0.zip`（可与 Chrome 用同一个文件）
3. 填写商店信息（参考 STORE_LISTING.md）

#### 3. 必填信息
- **显示名称**: NodScroll - Head Gesture Control
- **简短描述**: 从 STORE_LISTING.md 复制
- **详细描述**: 从 STORE_LISTING.md 复制
- **类别**: 生产力
- **语言**: 英语、中文（简体）

#### 4. 隐私
- 选择"使用隐私策略 URL"
- 填写: `https://hotea.github.io/NodScroll/PRIVACY_POLICY.html`

#### 5. 图标和媒体
- 图标已包含（自动读取）
- 需要至少 1 张截图

#### 6. 提交审核
- 审核时间：通常 1-2 个工作日

---

## 🌐 设置 GitHub Pages (托管隐私政策)

### 方法 1: 在仓库设置中启用

1. 推送代码到 GitHub:
```bash
git push -u origin main
```

2. 访问仓库设置：
   - https://github.com/hotea/NodScroll/settings/pages

3. 配置 Pages:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - 点击 Save

4. 等待几分钟，访问：
   - https://hotea.github.io/NodScroll/PRIVACY_POLICY.html

### 方法 2: 使用 gh-pages 分支（推荐）

```bash
# 创建 docs 文件夹
mkdir docs
cp PRIVACY_POLICY.html docs/

# 提交
git add docs/
git commit -m "Add privacy policy page"
git push

# 在 GitHub 设置中选择 /docs 文件夹
```

---

## 📸 准备截图建议

### 推荐截图内容：

1. **主界面截图**
   - 显示扩展 popup
   - 摄像头画面
   - 标注关键功能

2. **使用演示**
   - 用户点头的动画效果
   - 页面滚动的响应

3. **设置界面**
   - 展示可自定义选项

4. **权限页面**
   - 展示首次设置流程

### 制作工具：
- Chrome DevTools (F12) 截图
- macOS: Cmd+Shift+4
- Windows: Win+Shift+S
- 在线编辑：Figma, Canva

### 尺寸要求：
- **Chrome**: 1280x800 或 640x400
- **Edge**: 640x400 或 1280x800
- 格式：PNG 或 JPEG
- 最多 5 张

---

## ✅ 发布前检查清单

### 代码检查
- [x] 扩展在 Chrome/Edge 本地测试通过
- [x] 所有功能正常工作
- [x] 没有控制台错误
- [x] 图标显示正常

### 文档检查
- [x] README.md 完整
- [x] PRIVACY_POLICY.html 准备好
- [x] STORE_LISTING.md 信息完整
- [x] manifest.json 版本正确 (1.0.0)

### 商店准备
- [ ] 准备 1-5 张截图
- [ ] 可选：准备宣传图
- [ ] GitHub Pages 设置完成
- [ ] 隐私政策 URL 可访问

### 账号准备
- [ ] Chrome Web Store 开发者账号
- [ ] Edge Add-ons 开发者账号
- [ ] 已支付 Chrome 注册费（$5）

---

## 📊 预期时间线

| 步骤 | 预计时间 |
|------|---------|
| 创建开发者账号 | 10 分钟 |
| 设置 GitHub Pages | 5 分钟 |
| 准备截图 | 30 分钟 |
| 填写商店信息 | 20 分钟/平台 |
| Chrome 审核 | 1-3 天 |
| Edge 审核 | 1-2 天 |
| **总计** | **~3-5 天** |

---

## 🔧 审核常见问题

### 可能被拒原因：

1. **隐私政策缺失**
   - 解决：确保 GitHub Pages URL 可访问

2. **权限说明不清**
   - 解决：在描述中明确说明每个权限用途

3. **截图不符规范**
   - 解决：确保尺寸正确，内容清晰

4. **功能描述不准确**
   - 解决：确保描述与实际功能一致

### 审核通过后：

1. 扩展会在商店上架
2. 用户可以搜索和安装
3. 可以在开发者控制台查看统计数据

---

## 📈 发布后推广

### 社交媒体
- Twitter/X: 发布演示视频
- Reddit: r/chrome, r/productivity
- Product Hunt: 提交产品

### 内容营销
- 撰写博客文章
- 制作 YouTube 演示视频
- 在相关论坛分享

### SEO 优化
- 关键词：head gesture, hands-free browsing
- 在 README 中添加演示 GIF
- 创建官网或 Landing Page

---

## 📞 需要帮助？

如果在发布过程中遇到问题：

1. **Chrome Web Store 帮助**:
   - https://developer.chrome.com/docs/webstore/publish

2. **Edge Add-ons 帮助**:
   - https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension

3. **联系开发者**:
   - Email: oksukai@gmail.com
   - GitHub Issues: https://github.com/hotea/NodScroll/issues
