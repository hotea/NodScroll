# NodScroll 项目结构 / Project Structure

## 📁 目录组织 / Directory Organization

```
NodScroll/
│
├── 📦 扩展核心文件 / Core Extension Files
│   ├── manifest.json              # 扩展配置
│   ├── auth/                      # 权限授权页面
│   ├── background/                # Service Worker
│   ├── content/                   # 内容脚本
│   ├── offscreen/                 # 后台处理（MediaPipe）
│   ├── popup/                     # 弹窗界面
│   ├── lib/                       # 库文件
│   │   ├── head-tracker.js       # 头部追踪核心算法
│   │   ├── i18n.js               # 国际化
│   │   └── mediapipe/            # MediaPipe 库（34个文件）
│   └── icons/                     # 图标文件
│
├── 📚 开发文档 / Documentation (不提交到 git)
│   ├── docs/
│   │   ├── README.md             # 📖 文档索引
│   │   ├── PUBLISHING.md         # 发布完整指南
│   │   ├── EDGE_SUBMISSION.md    # Edge 提交指南
│   │   ├── SUBMISSION_READY.md   # 提交准备清单
│   │   ├── STORE_LISTING.md      # 商店信息
│   │   ├── SEARCH_KEYWORDS.md    # SEO 关键词
│   │   └── PROMO_DESIGN_GUIDE.md # 设计指南
│   └── docs/README.md            # ✅ 此文件会提交
│
├── 🔧 开发脚本 / Scripts (不提交到 git)
│   ├── scripts/
│   │   ├── generate_promo_tiles_v2.py  # 促销磁贴生成器
│   │   ├── generate_promo_tiles.py     # v1 (废弃)
│   │   └── resize-screenshots.sh       # 截图尺寸调整
│   └── scripts/README.md         # ✅ 此文件会提交
│
├── 🎨 营销材料 / Marketing Assets (不提交到 git)
│   ├── promo_tiles/
│   │   ├── small_promo_tile_440x280.png
│   │   └── large_promo_tile_1400x560.png
│   └── screenshots/
│       ├── *.png                 # 原始截图
│       └── resized/*.png         # 调整后的截图
│
├── 📄 根目录文件 / Root Files
│   ├── README.md                 # ✅ 项目说明（双语）
│   ├── PRIVACY_POLICY.html       # ✅ 隐私政策（GitHub Pages）
│   ├── .gitignore                # ✅ Git 忽略规则
│   └── nod-scroll-v1.0.0.zip     # ⚠️  扩展发布包（不提交）
│
└── 📋 其他
    └── build.sh                  # 构建脚本（如果有）
```

---

## 🔒 Git 版本控制策略

### ✅ 提交到 Git 的文件
```
扩展核心代码：
✅ manifest.json
✅ auth/*, background/*, content/*, offscreen/*, popup/*
✅ lib/head-tracker.js, lib/i18n.js
✅ lib/mediapipe/* (34个文件)
✅ icons/*

根目录文档：
✅ README.md (项目主页)
✅ PRIVACY_POLICY.html (需要 GitHub Pages 访问)

目录说明：
✅ docs/README.md
✅ scripts/README.md
✅ .gitignore
```

### ❌ 不提交到 Git 的文件（已在 .gitignore 中）
```
开发文档：
❌ docs/PUBLISHING.md
❌ docs/EDGE_SUBMISSION.md
❌ docs/SUBMISSION_READY.md
❌ docs/PROMO_DESIGN_GUIDE.md
❌ docs/SEARCH_KEYWORDS.md
❌ docs/STORE_LISTING.md

开发脚本：
❌ scripts/generate_promo_tiles*.py
❌ scripts/resize-screenshots.sh

生成的文件：
❌ promo_tiles/*
❌ screenshots/*
❌ *.zip (发布包)
❌ *.crx, *.pem

系统文件：
❌ .DS_Store
❌ .vscode/, .idea/
```

---

## 🎯 设计理念 / Design Philosophy

### 1. 关注点分离
- **核心代码** - 扩展功能实现
- **文档** - 发布和营销指南
- **脚本** - 自动化工具
- **资源** - 图片和媒体文件

### 2. Git 仓库精简
- 只提交必要的源代码和配置
- 文档和工具不污染提交历史
- 保持仓库体积小，克隆速度快

### 3. 本地开发友好
- 所有文档和工具保留在本地
- README 文件提供导航
- 清晰的目录结构

---

## 📖 快速导航 / Quick Navigation

### 我想要... / I want to...

**开始开发**
```bash
# 查看项目说明
cat README.md
```

**准备发布**
```bash
# 查看完整指南
cat docs/PUBLISHING.md
cat docs/SUBMISSION_READY.md
```

**提交到 Edge**
```bash
# 查看 Edge 专用指南
cat docs/EDGE_SUBMISSION.md
```

**生成营销材料**
```bash
# 生成促销磁贴
python3 scripts/generate_promo_tiles_v2.py

# 调整截图尺寸
./scripts/resize-screenshots.sh
```

**查看搜索关键词**
```bash
cat docs/SEARCH_KEYWORDS.md
```

**优化设计**
```bash
cat docs/PROMO_DESIGN_GUIDE.md
```

---

## 🔄 工作流程 / Workflow

### 开发阶段
```bash
1. 修改代码
2. 本地测试
3. git add [源代码文件]
4. git commit
5. git push
```

### 发布准备
```bash
1. 生成营销材料
   python3 scripts/generate_promo_tiles_v2.py
   ./scripts/resize-screenshots.sh

2. 查看提交清单
   cat docs/SUBMISSION_READY.md

3. 复制商店信息
   cat docs/STORE_LISTING.md
   cat docs/SEARCH_KEYWORDS.md

4. 提交到商店
   参考 docs/EDGE_SUBMISSION.md
```

### 版本更新
```bash
1. 更新 manifest.json 中的 version
2. 更新 docs/STORE_LISTING.md 中的描述
3. 重新生成截图（如有界面变化）
4. 打包并提交到商店
```

---

## ⚙️ .gitignore 配置说明

### 配置内容
```gitignore
# 保留目录结构，忽略内容
docs/*
!docs/README.md

scripts/*
!scripts/README.md

# 完全忽略
promo_tiles/
screenshots/
*.zip
```

### 效果
- ✅ `docs/` 和 `scripts/` 目录存在于 Git 中
- ✅ 只有 README.md 被追踪
- ❌ 其他文档和脚本不被追踪
- 💡 开发者可以在本地自由添加文件，不会影响 Git

---

## 🚀 优势 / Benefits

### 对开发者
- ✅ 根目录简洁清晰
- ✅ 文档集中管理
- ✅ 脚本工具易于查找
- ✅ Git 历史干净

### 对用户
- ✅ GitHub 页面专业整洁
- ✅ README 清晰易读
- ✅ 隐私政策可访问（GitHub Pages）
- ✅ 核心代码易于审查

### 对发布
- ✅ 所有发布材料本地准备
- ✅ 不会误提交临时文件
- ✅ 发布包不包含开发文件

---

## 📝 维护建议 / Maintenance Tips

### 添加新文档
```bash
# 直接在 docs/ 目录创建，自动被忽略
echo "# New Doc" > docs/NEW_GUIDE.md
```

### 添加新脚本
```bash
# 直接在 scripts/ 目录创建，自动被忽略
touch scripts/new_tool.py
chmod +x scripts/new_tool.py
```

### 如果需要追踪某个文档
```bash
# 方法1: 修改 .gitignore，添加例外
echo "!docs/IMPORTANT.md" >> .gitignore

# 方法2: 强制添加
git add -f docs/IMPORTANT.md
```

---

## 🔍 常见问题 / FAQ

**Q: 为什么不提交文档到 Git？**
A: 文档经常变动，提交后会污染历史记录。保留在本地更灵活。

**Q: 如果团队协作怎么办？**
A: 可以创建单独的文档仓库，或使用 wiki 功能。

**Q: 如何分享文档给其他开发者？**
A: 可以导出为 PDF，或通过其他渠道分享。核心的 README.md 已在仓库中。

**Q: promo_tiles 为什么不提交？**
A: 这些是生成的文件，可以随时用脚本重新生成。不需要版本控制。

**Q: 隐私政策为什么要提交？**
A: 因为 GitHub Pages 需要从仓库读取这个文件来展示。

---

## 📞 相关链接 / Related Links

- **GitHub 仓库**: https://github.com/hotea/NodScroll
- **隐私政策**: https://hotea.github.io/NodScroll/PRIVACY_POLICY.html
- **开发文档**: `docs/README.md`
- **脚本工具**: `scripts/README.md`

---

**结构清晰，开发高效！** 🚀
