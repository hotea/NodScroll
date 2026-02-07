#!/bin/bash
# NodScroll 扩展打包脚本

# 从 manifest.json 读取版本号
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)
PACKAGE_NAME="nod-scroll-v${VERSION}.zip"

echo "🔨 NodScroll 扩展打包"
echo "版本: ${VERSION}"
echo "================================"

# 删除旧的打包文件
if [ -f "$PACKAGE_NAME" ]; then
    echo "删除旧的打包文件..."
    rm "$PACKAGE_NAME"
fi

# 创建临时目录
TMP_DIR=$(mktemp -d)
echo "创建临时目录: $TMP_DIR"

# 复制需要的文件
echo "复制文件..."
cp -r manifest.json "$TMP_DIR/"
cp -r auth "$TMP_DIR/"
cp -r background "$TMP_DIR/"
cp -r content "$TMP_DIR/"
cp -r offscreen "$TMP_DIR/"
cp -r popup "$TMP_DIR/"
cp -r sandbox "$TMP_DIR/"
cp -r lib "$TMP_DIR/"
cp -r icons "$TMP_DIR/"
cp -r _locales "$TMP_DIR/"

# 进入临时目录打包
cd "$TMP_DIR"
echo "打包中..."
zip -r "$PACKAGE_NAME" . -x "*.DS_Store" "**/.DS_Store"

# 移动到项目目录
mv "$PACKAGE_NAME" "$OLDPWD/"
cd "$OLDPWD"

# 清理临时目录
rm -rf "$TMP_DIR"

# 显示结果
FILE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
FILE_COUNT=$(unzip -l "$PACKAGE_NAME" | tail -1 | awk '{print $2}')

echo "================================"
echo "✅ 打包完成！"
echo "文件: $PACKAGE_NAME"
echo "大小: $FILE_SIZE"
echo "文件数: $FILE_COUNT"
echo ""
echo "可以上传到:"
echo "- Chrome Web Store"
echo "- Microsoft Edge Add-ons"
