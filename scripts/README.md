# NodScroll 开发脚本 / Development Scripts

本目录包含用于生成营销材料和处理文件的开发脚本。

This directory contains development scripts for generating marketing materials and processing files.

---

## 🔧 脚本列表 / Scripts

### generate_promo_tiles_v2.py
**用途**: 生成促销磁贴

**功能**:
- 生成小促销磁贴 (440 x 280 像素)
- 生成大型促销磁贴 (1400 x 560 像素)
- 使用渐变背景和专业排版

**依赖**:
```bash
pip3 install Pillow
```

**使用方法**:
```bash
python3 scripts/generate_promo_tiles_v2.py
```

**输出**:
- `promo_tiles/small_promo_tile_440x280.png`
- `promo_tiles/large_promo_tile_1400x560.png`

---

### resize-screenshots.sh
**用途**: 批量调整截图尺寸

**功能**:
- 自动调整截图为 1280x800 尺寸
- 使用 macOS 自带的 sips 工具

**使用方法**:
```bash
# 将截图放入 screenshots/ 目录
# 然后运行：
./scripts/resize-screenshots.sh
```

**输出**:
- `screenshots/resized/*.png`

---

### generate_promo_tiles.py (v1, 已废弃)
**说明**: 第一版促销磁贴生成器，已被 v2 替代。

---

## 📋 使用场景 / Use Cases

### 场景 1: 首次发布
```bash
# 1. 生成促销磁贴
python3 scripts/generate_promo_tiles_v2.py

# 2. 调整截图尺寸
./scripts/resize-screenshots.sh

# 3. 查看输出
ls promo_tiles/
ls screenshots/resized/
```

### 场景 2: 更新版本
```bash
# 如果需要更新促销图，重新生成即可
python3 scripts/generate_promo_tiles_v2.py
```

---

## 🎨 自定义 / Customization

### 修改促销磁贴内容

编辑 `generate_promo_tiles_v2.py`:

```python
# 修改主标题（第 60 行）
main_title = "NodScroll"

# 修改副标题（第 70-71 行）
subtitle1 = "Exercise Your Neck"
subtitle2 = "While Browsing"

# 修改特性标签（第 82-86 行）
features = [
    "Head Gesture Control",
    "Privacy First",
    "AI Powered"
]
```

### 修改配色方案

编辑 `generate_promo_tiles_v2.py`:

```python
# 修改渐变颜色（第 14-16 行）
# 从 #1a1a2e 到 #4a90d9
r = int(26 + (74 - 26) * y / height)
g = int(26 + (144 - 26) * y / height)
b = int(46 + (217 - 46) * y / height)
```

---

## 🐍 Python 环境 / Python Environment

### 安装依赖
```bash
pip3 install Pillow
```

### 验证安装
```bash
python3 -c "from PIL import Image; print('Pillow installed successfully')"
```

---

## 🔍 故障排除 / Troubleshooting

### 问题: ModuleNotFoundError: No module named 'PIL'
**解决方案**:
```bash
pip3 install Pillow
```

### 问题: sips command not found
**解决方案**:
`sips` 是 macOS 自带工具。如果在其他系统上，可以使用 ImageMagick：
```bash
# Linux/Windows
brew install imagemagick  # 或 apt install imagemagick
magick convert input.png -resize 1280x800! output.png
```

### 问题: Permission denied
**解决方案**:
```bash
chmod +x scripts/resize-screenshots.sh
```

---

## 📝 注意事项 / Notes

- ✅ 这些脚本已添加到 `.gitignore`
- ✅ 不会包含在扩展发布包中
- ✅ 仅供开发者使用
- ⚠️ 生成的文件（promo_tiles/）也在 .gitignore 中

---

## 📖 相关文档 / Related Documentation

- **设计指南**: `../docs/PROMO_DESIGN_GUIDE.md`
- **提交指南**: `../docs/SUBMISSION_READY.md`
- **发布指南**: `../docs/PUBLISHING.md`

---

**这些脚本帮助你快速生成营销材料！** 🚀
