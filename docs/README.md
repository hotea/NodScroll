# NodScroll 开发文档 / Development Documentation

本目录包含发布和营销相关的指导文档，这些文档仅用于开发过程，不会包含在扩展发布包中。

This directory contains publishing and marketing guides for development purposes only. These files are not included in the extension package.

---

## 📚 文档列表 / Document List

### 发布指南 / Publishing Guides

**PUBLISHING.md**
- 完整的发布指南
- Chrome Web Store 和 Edge Add-ons 提交步骤
- GitHub Pages 设置说明

**EDGE_SUBMISSION.md**
- Edge Add-ons 专用提交指南
- 详细的字段填写说明
- 可直接复制的文本内容

**SUBMISSION_READY.md**
- 提交准备清单
- 核心定位说明
- 快速参考指南

---

### 营销材料 / Marketing Materials

**STORE_LISTING.md**
- 完整的商店信息
- 中英文描述
- 类别、标签、权限说明

**SEARCH_KEYWORDS.md**
- SEO 搜索关键词（7个）
- 关键词规则验证
- 搜索策略说明

**PROMO_DESIGN_GUIDE.md**
- 促销磁贴设计指南
- 视觉优化建议
- 设计工具和资源

---

## 🗂️ 文件组织 / File Organization

```
NodScroll/
├── docs/                    # 📚 开发文档（本目录）
│   ├── README.md
│   ├── PUBLISHING.md
│   ├── EDGE_SUBMISSION.md
│   ├── SUBMISSION_READY.md
│   ├── STORE_LISTING.md
│   ├── SEARCH_KEYWORDS.md
│   └── PROMO_DESIGN_GUIDE.md
│
├── scripts/                 # 🔧 开发脚本
│   ├── generate_promo_tiles_v2.py
│   └── resize-screenshots.sh
│
├── screenshots/             # 📸 截图工作目录
│   ├── resized/
│   └── *.png
│
├── promo_tiles/            # 🎨 促销磁贴
│   ├── small_promo_tile_440x280.png
│   └── large_promo_tile_1400x560.png
│
└── [扩展源代码...]
```

---

## 🚀 快速开始 / Quick Start

### 准备发布到商店

1. **查看提交清单**：
   ```bash
   cat docs/SUBMISSION_READY.md
   ```

2. **准备所需材料**：
   - 扩展包：`nod-scroll-v1.0.0.zip`
   - 截图：`screenshots/resized/`
   - 促销图：`promo_tiles/`
   - 隐私政策：https://hotea.github.io/NodScroll/PRIVACY_POLICY.html

3. **复制商店信息**：
   ```bash
   cat docs/STORE_LISTING.md
   cat docs/SEARCH_KEYWORDS.md
   ```

4. **按步骤提交**：
   - Chrome: 参考 `docs/PUBLISHING.md`
   - Edge: 参考 `docs/EDGE_SUBMISSION.md`

---

## 📝 注意事项 / Notes

### 版本控制
- ✅ 这些文档已添加到 `.gitignore`
- ✅ 不会包含在扩展发布包中
- ✅ 仅供开发者参考使用

### 文档更新
当扩展更新时，记得同步更新：
- 版本号
- 功能描述
- 截图
- 更新日志

---

## 🔗 相关链接 / Related Links

- **GitHub 仓库**: https://github.com/hotea/NodScroll
- **隐私政策**: https://hotea.github.io/NodScroll/PRIVACY_POLICY.html
- **Chrome Web Store**: https://chrome.google.com/webstore/devconsole
- **Edge Add-ons**: https://partner.microsoft.com/dashboard/microsoftedge

---

**这些文档帮助你顺利发布 NodScroll！** 🚀
